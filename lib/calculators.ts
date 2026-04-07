export interface CalculatorField {
  id: string;
  label: string;
  suffix?: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  type?: "number" | "select";
  options?: { value: number; label: string }[];
}

export interface CalculatorResult {
  label: string;
  compute?: string;
  key?: string;
  highlight?: boolean;
  isSectionHeader?: boolean;
}

export interface Calculator {
  slug: string;
  title: string;
  excerpt: string;
  category:
    | "Gehalt & Arbeit"
    | "Sparen & Budget"
    | "Investieren"
    | "Alltag & Lifestyle"
    | "Studium & Ausbildung"
    | "Rente & Vorsorge";
  categoryEmoji: string;
  fields: CalculatorField[];
  results: CalculatorResult[];
  computeAll?: (
    values: Record<string, number>,
  ) => Record<string, number | string>;
}

// ═══════════════════════════════════════════════════════════════════
// GERMAN TAX ENGINE 2025
// ═══════════════════════════════════════════════════════════════════

const BBG_KV = 66150; // Beitragsbemessungsgrenze KV/PV 2025 (jährlich)
const BBG_RV = 96600; // Beitragsbemessungsgrenze RV/ALV 2025 (jährlich)

/** §32a EStG 2025 — Grundtarif */
function estGrundtarif(zvE: number): number {
  zvE = Math.floor(Math.max(0, zvE));
  if (zvE <= 12096) return 0;
  if (zvE <= 17443) {
    const y = (zvE - 12096) / 10000;
    return Math.floor((922.98 * y + 1400) * y);
  }
  if (zvE <= 66760) {
    const z = (zvE - 17443) / 10000;
    return Math.floor((181.19 * z + 2397) * z + 1025.38);
  }
  if (zvE <= 277825) {
    return Math.floor(0.42 * zvE - 10636.31);
  }
  return Math.floor(0.45 * zvE - 18971.06);
}

/** §32a EStG 2025 — Splittingtarif (Steuerklasse III) */
function estSplitting(zvE: number): number {
  return 2 * estGrundtarif(Math.floor(zvE / 2));
}

/** Brutto-Netto-Berechnung 2025 */
function computeBruttoNetto(
  v: Record<string, number>,
): Record<string, number | string> {
  const bruttoMonat = v.brutto ?? 2500;
  const sk = v.steuerklasse ?? 1;
  const bl = v.bundesland ?? 10;
  const kirchensteuerpflichtig = v.kirchensteuer ?? 0;
  const alter = v.alter ?? 25;
  const kinderFB = v.kinder ?? 0;
  const kvArt = v.kvArt ?? 0; // 0 = allgemein (14,6%), 1 = ermäßigt (14,0%)
  const zusatzbeitragPct = v.zusatzbeitrag ?? 2.5;

  const bruttoJahr = bruttoMonat * 12;

  // ── 1. Sozialversicherung (AN-Anteil, jährlich) ──────────────
  const rvBrutto = Math.min(bruttoJahr, BBG_RV);
  const kvBrutto = Math.min(bruttoJahr, BBG_KV);

  const rvAN = rvBrutto * 0.093; // RV 18,6% / 2
  const alvAN = rvBrutto * 0.013; // ALV 2,6% / 2

  // KV: Basissatz / 2 + Zusatzbeitrag / 2
  const kvBasisSatz = kvArt === 0 ? 0.146 : 0.14;
  const kvANSatz = kvBasisSatz / 2 + zusatzbeitragPct / 100 / 2;
  const kvAN = kvBrutto * kvANSatz;

  // PV 2025: Gesamtbeitrag 3,6%, AN-Basis 1,8%
  // Kinderlose ab 23: +0,6% Zuschlag
  // Ab 2. Kind (unter 25): −0,25% pro Kind (max 4 Abschläge)
  let pvANSatz: number;
  const kinderGanz = Math.floor(kinderFB); // Kinderfreibeträge → ganze Kinder für PV
  if (kinderGanz === 0 && alter >= 23) {
    pvANSatz = 0.024; // 1,8% + 0,6%
  } else if (kinderGanz <= 1) {
    pvANSatz = 0.018; // 1,8%
  } else {
    const abschlag = Math.min(kinderGanz - 1, 4) * 0.0025;
    pvANSatz = Math.max(0.007, 0.018 - abschlag);
  }
  const pvAN = kvBrutto * pvANSatz;

  // ── 2. Lohnsteuer ────────────────────────────────────────────
  // Vorsorgepauschale (§39b Abs. 2 S. 5 Nr. 3 EStG)
  const vpRV = rvAN; // Teilbetrag 1: RV-Beitrag AN
  const vpMindest = Math.min(bruttoJahr * 0.12, sk === 3 ? 3000 : 1900); // Teilbetrag 2
  const vpKVPV = kvAN + pvAN; // Teilbetrag 3: KV + PV (AN)
  const vorsorgepauschale = vpRV + Math.max(vpMindest, vpKVPV);

  let zvE: number;
  let est: number;

  switch (sk) {
    case 1:
    case 4:
      zvE = bruttoJahr - 1230 - 36 - vorsorgepauschale;
      est = estGrundtarif(zvE);
      break;
    case 2:
      // Entlastungsbetrag für Alleinerziehende: 4.260€
      zvE = bruttoJahr - 1230 - 36 - vorsorgepauschale - 4260;
      est = estGrundtarif(zvE);
      break;
    case 3:
      zvE = bruttoJahr - 1230 - 36 - vorsorgepauschale;
      est = estSplitting(zvE);
      break;
    case 5:
      // SK V: kein Grundfreibetrag-Vorteil
      zvE = bruttoJahr - vorsorgepauschale;
      est = estGrundtarif(zvE);
      break;
    case 6:
      // SK VI: keine Freibeträge
      zvE = bruttoJahr;
      est = estGrundtarif(zvE);
      break;
    default:
      zvE = bruttoJahr - 1230 - 36 - vorsorgepauschale;
      est = estGrundtarif(zvE);
  }

  const lohnsteuerJahr = Math.max(0, est);

  // Solidaritätszuschlag: 5,5% der ESt, Freigrenze 18.130€ / 36.260€
  const soliFrei = sk === 3 ? 36260 : 18130;
  let soliJahr = 0;
  if (lohnsteuerJahr > soliFrei) {
    const ueber = lohnsteuerJahr - soliFrei;
    soliJahr = Math.min(lohnsteuerJahr * 0.055, ueber * 0.119);
  }

  // Kirchensteuer: 8% (BaWü/Bayern) oder 9% (Rest)
  const kistSatz = bl === 1 || bl === 2 ? 0.08 : 0.09;
  const kistJahr = kirchensteuerpflichtig === 1 ? lohnsteuerJahr * kistSatz : 0;

  // ── 3. Monatswerte ───────────────────────────────────────────
  const rd = (x: number) => Math.round(x * 100) / 100;

  const lohnsteuerMonat = rd(lohnsteuerJahr / 12);
  const soliMonat = rd(soliJahr / 12);
  const kistMonat = rd(kistJahr / 12);
  const rvMonat = rd(rvAN / 12);
  const alvMonat = rd(alvAN / 12);
  const kvMonat = rd(kvAN / 12);
  const pvMonat = rd(pvAN / 12);

  const steuernGesamt = rd(lohnsteuerMonat + soliMonat + kistMonat);
  const svGesamtMonat = rd(rvMonat + alvMonat + kvMonat + pvMonat);
  const abzuegeGesamt = rd(steuernGesamt + svGesamtMonat);
  const nettoMonat = rd(bruttoMonat - abzuegeGesamt);

  return {
    netto: nettoMonat,
    lohnsteuer: lohnsteuerMonat,
    soli: soliMonat,
    kirchensteuer_betrag: kistMonat,
    steuern_gesamt: steuernGesamt,
    rv: rvMonat,
    alv: alvMonat,
    kv: kvMonat,
    pv: pvMonat,
    sv_gesamt: svGesamtMonat,
    abzuege_gesamt: abzuegeGesamt,
  };
}

/** Sparplan / Sparrechner – Zinseszins mit Steuern */
function computeSparplan(
  v: Record<string, number>,
): Record<string, number | string> {
  const anfangskapital = v.anfangskapital ?? 0;
  const sparrate = v.sparrate ?? 100;
  const sparintervallMonate = v.sparintervall ?? 1; // 1 / 3 / 6 / 12
  const renditePA = v.rendite ?? 7; // % p.a.
  const laufzeit = v.laufzeit ?? 10; // Jahre
  const mitSteuern = v.steuern ?? 0;
  const sparerpauschbetrag = v.sparerpauschbetrag ?? 1000;
  const mitTeilfreistellung = v.teilfreistellung ?? 1;

  const rMonthly = renditePA / 100 / 12;
  const nMonths = Math.round(laufzeit * 12);

  let endkapital: number;

  if (renditePA === 0 || rMonthly === 0) {
    const nPayments = Math.floor(nMonths / sparintervallMonate);
    endkapital = anfangskapital + sparrate * nPayments;
  } else {
    // FV of initial capital (monthly compounding)
    const fvInitial = anfangskapital * Math.pow(1 + rMonthly, nMonths);

    // FV of periodic payments (annuity due — payment at start of period)
    // Effective rate per payment period = (1 + r_m)^k - 1
    const rPeriod = Math.pow(1 + rMonthly, sparintervallMonate) - 1;
    const nPayments = Math.floor(nMonths / sparintervallMonate);
    const fvPayments =
      sparrate *
      ((Math.pow(1 + rPeriod, nPayments) - 1) / rPeriod) *
      (1 + rPeriod);

    endkapital = fvInitial + fvPayments;
  }

  const nPayments = Math.floor(nMonths / sparintervallMonate);
  const sparratenGesamt = sparrate * nPayments;
  const einzahlungen = anfangskapital + sparratenGesamt;
  const gewinn = endkapital - einzahlungen;

  // ── Steuern (KapESt + Soli = 26,375%) ──
  let steuerpflichtig = gewinn;
  if (mitTeilfreistellung === 1) {
    steuerpflichtig = gewinn * 0.7; // 30% Teilfreistellung Aktienfonds
  }
  steuerpflichtig = Math.max(0, steuerpflichtig - sparerpauschbetrag);

  const steuer = mitSteuern === 1 ? steuerpflichtig * 0.26375 : 0;
  const endkapitalNetto = endkapital - steuer;

  const rd = (x: number) => Math.round(x * 100) / 100;

  return {
    endkapital: rd(endkapitalNetto),
    endkapital_brutto: rd(endkapital),
    einzahlungen: rd(einzahlungen),
    anfangskapital_out: rd(anfangskapital),
    sparraten_gesamt: rd(sparratenGesamt),
    gewinn: rd(gewinn),
    steuerpflichtiger_gewinn: rd(mitSteuern === 1 ? steuerpflichtig : 0),
    kapitalertragsteuer: rd(steuer),
  };
}

/** Zinsrechner – Einmalanlage mit Zinseszins und optionaler Steuer */
function computeZins(
  v: Record<string, number>,
): Record<string, number | string> {
  const anfangskapital = v.anfangskapital ?? 10000;
  const zinssatzPA = v.zinssatz ?? 3.5; // % p.a. (nominal)
  const laufzeitJahre = v.laufzeitJahre ?? 5;
  const laufzeitMonate = v.laufzeitMonate ?? 0;
  const zinsintervall = v.zinsintervall ?? 12; // 1=jaehrlich,4=quartal,12=monat
  const mitSteuern = v.steuern ?? 0;
  const sparerpauschbetrag = v.sparerpauschbetrag ?? 1000;

  const gesamtMonate = laufzeitJahre * 12 + laufzeitMonate;
  const gesamtJahre = gesamtMonate / 12;

  // Zinseszins: FV = P × (1 + r/n)^(n×t)
  const r = zinssatzPA / 100;
  const n = zinsintervall; // Zinsperioden pro Jahr
  let endkapital: number;

  if (r === 0) {
    endkapital = anfangskapital;
  } else {
    const periods = n * gesamtJahre;
    endkapital = anfangskapital * Math.pow(1 + r / n, periods);
  }

  const zinsen = endkapital - anfangskapital;

  // Steuern (KapESt 26,375%)
  const steuerpflichtig = Math.max(0, zinsen - sparerpauschbetrag);
  const steuer = mitSteuern === 1 ? steuerpflichtig * 0.26375 : 0;
  const endkapitalNetto = endkapital - steuer;

  const rd = (x: number) => Math.round(x * 100) / 100;

  return {
    endkapital: rd(endkapitalNetto),
    endkapital_brutto: rd(endkapital),
    anfangskapital_out: rd(anfangskapital),
    zinsen: rd(zinsen),
    effektivzins: rd(
      gesamtJahre > 0
        ? (Math.pow(endkapital / anfangskapital, 1 / gesamtJahre) - 1) * 100
        : 0,
    ),
    steuerpflichtiger_gewinn: rd(mitSteuern === 1 ? steuerpflichtig : 0),
    kapitalertragsteuer: rd(steuer),
  };
}

/** Budget-Rechner – 50-30-20 Best Practice mit echten Kategorien */
function computeBudget(
  v: Record<string, number>,
): Record<string, number | string> {
  const netto = v.netto ?? 1800;

  // ── Fixkosten (Needs / Grundbedarf) ──
  const miete = v.miete ?? 550;
  const nebenkosten = v.nebenkosten ?? 80;
  const lebensmittel = v.lebensmittel ?? 250;
  const handyInternet = v.handyInternet ?? 30;
  const versicherungen = v.versicherungen ?? 50;
  const mobilitaet = v.mobilitaet ?? 50;

  // ── Lifestyle (Wants / Wuensche) ──
  const hobbys = v.hobbys ?? 50;
  const freizeitAusgehen = v.freizeitAusgehen ?? 100;
  const shoppingKleidung = v.shoppingKleidung ?? 50;
  const urlaubReisen = v.urlaubReisen ?? 80;
  const abosStreaming = v.abosStreaming ?? 30;

  const fixkosten =
    miete +
    nebenkosten +
    lebensmittel +
    handyInternet +
    versicherungen +
    mobilitaet;
  const lifestyle =
    hobbys + freizeitAusgehen + shoppingKleidung + urlaubReisen + abosStreaming;
  const ausgabenGesamt = fixkosten + lifestyle;
  const sparenVerf = netto - ausgabenGesamt;

  const rd = (x: number) => Math.round(x * 100) / 100;
  const pct = (x: number) =>
    netto > 0 ? Math.round((x / netto) * 1000) / 10 : 0;

  // ── Best-Practice 50-30-20 ──
  const fixPct = pct(fixkosten);
  const lifePct = pct(lifestyle);
  const sparPct = pct(sparenVerf);

  const empf50 = rd(netto * 0.5);
  const empf30 = rd(netto * 0.3);
  const empf20 = rd(netto * 0.2);

  // Bewertung
  let bewertungFix: string;
  if (fixPct <= 50) bewertungFix = "Im gruenen Bereich (max. 50%)";
  else if (fixPct <= 60)
    bewertungFix = "Etwas ueber Budget – pruefe Sparpotenzial";
  else bewertungFix = "Deutlich ueber 50% – Handlungsbedarf!";

  let bewertungLife: string;
  if (lifePct <= 30) bewertungLife = "Im gruenen Bereich (max. 30%)";
  else if (lifePct <= 40)
    bewertungLife = "Etwas ueber Budget – bewusster ausgeben";
  else bewertungLife = "Deutlich ueber 30% – reduzieren empfohlen";

  let bewertungSpar: string;
  if (sparPct >= 20) bewertungSpar = "Super! Du sparst genug (mind. 20%)";
  else if (sparPct >= 10) bewertungSpar = "Gut, aber 20% waeren ideal";
  else if (sparPct > 0) bewertungSpar = "Zu wenig – Ausgaben pruefen!";
  else bewertungSpar = "Achtung: Kein Geld zum Sparen uebrig!";

  return {
    sparen: rd(sparenVerf),
    sparen_pct: sparPct,
    fixkosten_total: rd(fixkosten),
    fixkosten_pct: fixPct,
    fixkosten_empf: empf50,
    fixkosten_bewertung: bewertungFix,
    lifestyle_total: rd(lifestyle),
    lifestyle_pct: lifePct,
    lifestyle_empf: empf30,
    lifestyle_bewertung: bewertungLife,
    ausgaben_gesamt: rd(ausgabenGesamt),
    sparen_empf: empf20,
    sparen_bewertung: bewertungSpar,
  };
}

/** Mietkosten-Rechner – alle Wohnkosten mit personalisierter Bewertung */
function computeMietkosten(
  v: Record<string, number>,
): Record<string, number | string> {
  const nettoEinkommen = v.netto ?? 1800;
  const weiteresEinkommen = v.weiteresEinkommen ?? 0;
  const gesamtEinkommen = nettoEinkommen + weiteresEinkommen;

  // Wohnform: 0=Allein, 1=WG, 2=Mit Partner
  const wohnform = v.wohnform ?? 0;
  // Stadttyp: 0=Grossstadt, 1=Mittelstadt, 2=Kleinstadt
  const stadttyp = v.stadttyp ?? 0;

  const kaltmiete = v.kaltmiete ?? 550;
  const nebenkosten = v.nebenkosten ?? 100;
  const strom = v.strom ?? 40;
  const internet = v.internet ?? 30;
  const gez = v.gez ?? (wohnform === 1 ? 6.12 : wohnform === 2 ? 9.18 : 18.36);
  const hausrat = v.hausrat ?? 5;
  const qm = v.qm ?? 40;

  const warmmiete = kaltmiete + nebenkosten;
  const wohnkostenGesamt = warmmiete + strom + internet + gez + hausrat;
  const preisProQm = qm > 0 ? kaltmiete / qm : 0;
  const kautionGesamt = kaltmiete * 3;

  // Wohnkostenquote
  const wohnkostenQuote =
    gesamtEinkommen > 0
      ? Math.round((wohnkostenGesamt / gesamtEinkommen) * 1000) / 10
      : 0;

  // Empfehlung je nach Stadttyp
  let empfPct: number;
  let stadtLabel: string;
  if (stadttyp === 0) {
    empfPct = 35;
    stadtLabel = "Grossstadt";
  } else if (stadttyp === 1) {
    empfPct = 30;
    stadtLabel = "Mittelstadt";
  } else {
    empfPct = 25;
    stadtLabel = "Kleinstadt";
  }
  const empfMax = Math.round(gesamtEinkommen * (empfPct / 100) * 100) / 100;
  const differenz = empfMax - wohnkostenGesamt;
  const restBudget = gesamtEinkommen - wohnkostenGesamt;

  // Bewertung
  let bewertung: string;
  if (wohnkostenQuote <= empfPct) {
    bewertung = "Im gruenen Bereich – passt zu deinem Budget!";
  } else if (wohnkostenQuote <= empfPct + 5) {
    bewertung = "Knapp ueber der Empfehlung – noch vertretbar";
  } else if (wohnkostenQuote <= empfPct + 15) {
    bewertung = "Deutlich ueber Budget – Sparpotenzial noetig";
  } else {
    bewertung = "Achtung: Wohnkosten viel zu hoch!";
  }

  // Empfohlene Wohnungsgroesse je Wohnform
  let empfQm: string;
  if (wohnform === 0) empfQm = "25-45 m² (1 Person)";
  else if (wohnform === 1) empfQm = "15-20 m² eigenes Zimmer";
  else empfQm = "50-70 m² (2 Personen)";

  const rd = (x: number) => Math.round(x * 100) / 100;

  return {
    wohnkosten_gesamt: rd(wohnkostenGesamt),
    warmmiete: rd(warmmiete),
    kaltmiete_out: rd(kaltmiete),
    nebenkosten_out: rd(nebenkosten),
    strom_out: rd(strom),
    internet_out: rd(internet),
    gez_out: rd(gez),
    hausrat_out: rd(hausrat),
    wohnkosten_quote: wohnkostenQuote,
    empf_max: rd(empfMax),
    empf_pct: empfPct + "% (" + stadtLabel + ")",
    differenz: rd(differenz),
    rest_budget: rd(restBudget),
    preis_pro_qm: rd(preisProQm),
    kaution_3m: rd(kautionGesamt),
    bewertung: bewertung,
    empf_qm: empfQm,
  };
}

// ── Taschengeld-Rechner Engine ──────────────────────────────────────────
// DJI Taschengeldtabelle 2025/2026 – monatliche Empfehlungen
// (unter 10: Wochenbeträge × 4,33 umgerechnet auf Monatsbasis)
function getTaschengeldEmpfehlung(alter: number): {
  min: number;
  max: number;
  woche: boolean;
} {
  if (alter <= 5) return { min: 2.17, max: 2.17, woche: true }; // 0,50€/Woche
  if (alter === 6) return { min: 4.33, max: 6.5, woche: true }; // 1,00-1,50€/W
  if (alter === 7) return { min: 6.5, max: 8.66, woche: true }; // 1,50-2,00€/W
  if (alter === 8) return { min: 8.66, max: 10.83, woche: true }; // 2,00-2,50€/W
  if (alter === 9) return { min: 10.83, max: 13.0, woche: true }; // 2,50-3,00€/W
  if (alter === 10) return { min: 15.0, max: 17.5, woche: false };
  if (alter === 11) return { min: 17.5, max: 20.0, woche: false };
  if (alter === 12) return { min: 20.0, max: 22.5, woche: false };
  if (alter === 13) return { min: 22.5, max: 25.0, woche: false };
  if (alter === 14) return { min: 25.5, max: 30.5, woche: false };
  if (alter === 15) return { min: 30.5, max: 38.0, woche: false };
  if (alter === 16) return { min: 38.0, max: 45.5, woche: false };
  if (alter === 17) return { min: 45.5, max: 61.0, woche: false };
  return { min: 61.0, max: 76.0, woche: false }; // 18+
}

function computeTaschengeld(
  v: Record<string, number>,
): Record<string, number | string> {
  const alter = v.alter ?? 14;
  const status = v.status ?? 0; // 0=Schüler, 1=Azubi, 2=Student, 3=Berufstätig
  const taschengeld = v.taschengeld ?? 30;
  const nebenjob = v.nebenjob ?? 0;
  const handykosten = v.handykosten ?? 0;
  const streaming = v.streaming ?? 0;
  const mobilitaet = v.mobilitaet ?? 0;
  const schulmaterial = v.schulmaterial ?? 0;
  const sparziel = v.sparziel ?? 0;
  const sparzeit = v.sparzeit ?? 6;

  // ── Empfehlung nach Alter ──
  const empf = getTaschengeldEmpfehlung(alter);
  const empfMitte = Math.round(((empf.min + empf.max) / 2) * 100) / 100;

  // ── Gesamtbudget ──
  const gesamtbudget = taschengeld + nebenjob;

  // ── Differenz zur Empfehlung ──
  const diffEmpf = Math.round((taschengeld - empfMitte) * 100) / 100;

  // ── Bewertung Taschengeld vs Empfehlung ──
  let bewertungTG: string;
  if (taschengeld < empf.min) {
    bewertungTG = "Unter der DJI-Empfehlung – eventuell nachverhandeln?";
  } else if (taschengeld <= empf.max) {
    bewertungTG = "Im empfohlenen Bereich – passt!";
  } else if (taschengeld <= empf.max * 1.3) {
    bewertungTG =
      "Leicht ueber der Empfehlung – gut, wenn du es sinnvoll aufteilst";
  } else {
    bewertungTG =
      "Deutlich ueber der Empfehlung – umso wichtiger, smart zu sparen!";
  }

  // ── Fixkosten ──
  const fixkosten = handykosten + streaming + mobilitaet + schulmaterial;
  const fixkostenPct =
    gesamtbudget > 0 ? Math.round((fixkosten / gesamtbudget) * 1000) / 10 : 0;

  // ── Restbudget ──
  const restNachFix = gesamtbudget - fixkosten;

  // ── 50-30-20 Aufteilung (angepasst fuer Jugendliche) ──
  // Bedarf (50%): Handy, Fahrkarte, Schulmaterial
  // Freizeit (30%): Ausgehen, Hobbys, Snacks, Kino
  // Sparen (20%): ETF, Sparziel, Notgroschen
  const budgetBedarf = Math.round(gesamtbudget * 0.5 * 100) / 100;
  const budgetFreizeit = Math.round(gesamtbudget * 0.3 * 100) / 100;
  const budgetSparen = Math.round(gesamtbudget * 0.2 * 100) / 100;

  // ── Bewertung Fixkosten ──
  let bewertungFix: string;
  if (fixkostenPct <= 50) {
    bewertungFix = "Deine Fixkosten sind im Rahmen – gut!";
  } else if (fixkostenPct <= 70) {
    bewertungFix =
      "Fixkosten sind hoch – pruefe, ob du Streaming oder Handy guenstiger bekommst";
  } else {
    bewertungFix =
      "Fixkosten fressen fast alles auf – dringend Einsparpotenzial suchen!";
  }

  // ── Freizeit-Budget nach Fixkosten ──
  const freizeitReal = Math.max(0, Math.round(restNachFix * 0.6 * 100) / 100);
  const sparenReal = Math.max(0, Math.round(restNachFix * 0.4 * 100) / 100);

  // ── Sparziel-Analyse ──
  const sparrateNoetig =
    sparzeit > 0 ? Math.round((sparziel / sparzeit) * 100) / 100 : 0;
  const monateReal = sparenReal > 0 ? Math.ceil(sparziel / sparenReal) : 0;

  let bewertungSparziel: string;
  if (sparziel === 0) {
    bewertungSparziel =
      "Kein Sparziel angegeben – setz dir eins, es motiviert!";
  } else if (sparenReal >= sparrateNoetig) {
    bewertungSparziel =
      "Sparziel erreichbar in " + sparzeit + " Monaten – top!";
  } else if (monateReal <= sparzeit * 1.5) {
    bewertungSparziel =
      "Dauert etwas laenger (" + monateReal + " Monate) – aber machbar!";
  } else {
    bewertungSparziel =
      "Sparziel ambitioniert – Nebenjob oder laengeren Zeitraum ueberlegen";
  }

  // ── Nebenjob-Potenzial ──
  // Mindestlohn 2025: 12,82€/h, unter 18: ca. 8-10€/h typisch
  const stundenlohn = alter < 18 ? 9 : 12.82;
  const maxStundenWoche = alter < 16 ? 0 : alter < 18 ? 10 : 20;
  const nebenjobPotenzial = Math.round(stundenlohn * maxStundenWoche * 4.33);

  let nebenjobTipp: string;
  if (alter < 16) {
    nebenjobTipp =
      "Unter 16: Minijobs eingeschraenkt – Nachbarschaftshilfe, Babysitten moeglich";
  } else if (alter < 18) {
    nebenjobTipp =
      "16-17 J.: Max. 10h/Woche moeglich (Jugendarbeitsschutz) – ca. " +
      nebenjobPotenzial +
      " EUR/Monat";
  } else if (status === 2) {
    nebenjobTipp =
      "Als Student: Bis 20h/Woche als Werkstudent – ca. " +
      nebenjobPotenzial +
      " EUR/Monat moeglich";
  } else {
    nebenjobTipp =
      "Als Erwachsener: Minijob bis 556 EUR/Monat steuerfrei (2025)";
  }

  // ── Spar-Ideen Text ──
  let sparIdeen: string;
  if (alter <= 14) {
    sparIdeen = "Spardose, Tagesgeldkonto, Wunschliste fuehren";
  } else if (alter <= 17) {
    sparIdeen =
      "Juniordepot/ETF-Sparplan (mit Eltern), Tagesgeld, 50€-Challenge";
  } else {
    sparIdeen =
      "ETF-Sparplan (ab 1 EUR/Monat), Tagesgeld, automatischer Dauerauftrag";
  }

  return {
    empf_min: empf.min,
    empf_max: empf.max,
    empf_mitte: empfMitte,
    diff_empf: diffEmpf,
    bewertung_tg: bewertungTG,
    gesamtbudget,
    fixkosten,
    fixkosten_pct: fixkostenPct,
    bewertung_fix: bewertungFix,
    rest_nach_fix: restNachFix,
    budget_bedarf: budgetBedarf,
    budget_freizeit: budgetFreizeit,
    budget_sparen: budgetSparen,
    freizeit_real: freizeitReal,
    sparen_real: sparenReal,
    sparrate_noetig: sparrateNoetig,
    monate_real: monateReal > 0 ? monateReal : 0,
    bewertung_sparziel: bewertungSparziel,
    nebenjob_potenzial: nebenjobPotenzial,
    nebenjob_tipp: nebenjobTipp,
    spar_ideen: sparIdeen,
  };
}

// ── Notgroschen-Rechner Engine ──────────────────────────────────────────
function computeNotgroschen(
  v: Record<string, number>,
): Record<string, number | string> {
  const netto = v.netto ?? 2000;
  const miete = v.miete ?? 600;
  const nebenkosten = v.nebenkosten ?? 150;
  const versicherungen = v.versicherungen ?? 50;
  const mobilitaet = v.mobilitaet ?? 50;
  const lebensmittel = v.lebensmittel ?? 250;
  const sonstiges = v.sonstiges ?? 100;
  const status = v.status ?? 0; // 0=Angestellt, 1=Selbststaendig, 2=Student, 3=Azubi
  const haustier = v.haustier ?? 0; // 0=Nein, 1=Ja
  const auto = v.auto ?? 0; // 0=Nein, 1=Ja
  const sparrate = v.sparrate ?? 200;
  const vorhanden = v.vorhanden ?? 0;

  // ── Monatliche Fixkosten berechnen ──
  const fixkosten =
    miete +
    nebenkosten +
    versicherungen +
    mobilitaet +
    lebensmittel +
    sonstiges;

  // ── Empfohlene Monate je nach Status ──
  // Angestellt: 3-6 Monate, Selbststaendig: 6-12, Student: 2-3, Azubi: 2-3
  let empfMonateMin: number;
  let empfMonateMax: number;
  let statusText: string;
  if (status === 1) {
    empfMonateMin = 6;
    empfMonateMax = 12;
    statusText = "Selbststaendig – hoehere Absicherung empfohlen (6-12 Monate)";
  } else if (status === 2) {
    empfMonateMin = 2;
    empfMonateMax = 3;
    statusText = "Student/in – 2-3 Monate reichen meist aus";
  } else if (status === 3) {
    empfMonateMin = 2;
    empfMonateMax = 3;
    statusText = "Azubi – 2-3 Monate als Grundabsicherung";
  } else {
    empfMonateMin = 3;
    empfMonateMax = 6;
    statusText = "Angestellt – 3-6 Monate sind der Goldstandard";
  }

  // ── Risikozuschlaege ──
  let zuschlagAuto = 0;
  let zuschlagHaustier = 0;
  if (auto === 1) zuschlagAuto = 1500; // Autoreparatur-Puffer
  if (haustier === 1) zuschlagHaustier = 500; // Tierarzt-Puffer

  // ── Notgroschen berechnen ──
  const notgroschenMin =
    fixkosten * empfMonateMin + zuschlagAuto + zuschlagHaustier;
  const notgroschenMax =
    fixkosten * empfMonateMax + zuschlagAuto + zuschlagHaustier;
  const notgroschenEmpf = Math.round((notgroschenMin + notgroschenMax) / 2);

  // ── Aktueller Stand ──
  const differenz = vorhanden - notgroschenEmpf;
  const fortschrittPct =
    notgroschenEmpf > 0
      ? Math.min(100, Math.round((vorhanden / notgroschenEmpf) * 1000) / 10)
      : 0;

  // ── Bewertung ──
  let bewertung: string;
  if (vorhanden >= notgroschenMax) {
    bewertung = "Top abgesichert! Ueberschuss ggf. in ETFs investieren";
  } else if (vorhanden >= notgroschenEmpf) {
    bewertung = "Gut aufgestellt – weiter aufbauen bis zur Obergrenze";
  } else if (vorhanden >= notgroschenMin) {
    bewertung = "Basisabsicherung erreicht – Ziel: Empfehlung (Mitte)";
  } else if (vorhanden > 0) {
    bewertung = "Guter Anfang, aber noch nicht ausreichend – dranbleiben!";
  } else {
    bewertung =
      "Noch kein Notgroschen – starte heute, auch mit kleinen Betraegen!";
  }

  // ── Aufbauplan ──
  const fehlbetrag = Math.max(0, notgroschenEmpf - vorhanden);
  const monateAufbau = sparrate > 0 ? Math.ceil(fehlbetrag / sparrate) : 0;

  // ── Sparrate berechnen fuer verschiedene Zeitraeume ──
  const sparrate6m = fehlbetrag > 0 ? Math.round(fehlbetrag / 6) : 0;
  const sparrate12m = fehlbetrag > 0 ? Math.round(fehlbetrag / 12) : 0;
  const sparrate24m = fehlbetrag > 0 ? Math.round(fehlbetrag / 24) : 0;

  // ── Tagesgeld-Ertrag (Schätzung 3% p.a.) ──
  const tagesgeldZins = 0.03;
  const tagesgeldErtrag = Math.round(notgroschenEmpf * tagesgeldZins);

  // ── Fixkosten-Quote ──
  const fixkostenQuote =
    netto > 0 ? Math.round((fixkosten / netto) * 1000) / 10 : 0;

  // ── Sparquote ──
  const sparquote = netto > 0 ? Math.round((sparrate / netto) * 1000) / 10 : 0;

  // ── Empfehlung Tagesgeld ──
  let tagesgeldTipp: string;
  if (notgroschenEmpf < 3000) {
    tagesgeldTipp =
      "Tagesgeld reicht – z.B. Trade Republic, ING, DKB (3-3,5% Zinsen)";
  } else if (notgroschenEmpf < 10000) {
    tagesgeldTipp =
      "Tagesgeld ideal – Zinsen von ca. " +
      tagesgeldErtrag +
      " EUR/Jahr mitnehmen";
  } else {
    tagesgeldTipp =
      "Ggf. auf 2 Tagesgeldkonten aufteilen (Einlagensicherung beachten)";
  }

  return {
    fixkosten,
    fixkosten_quote: fixkostenQuote,
    empf_monate_min: empfMonateMin,
    empf_monate_max: empfMonateMax,
    status_text: statusText,
    zuschlag_auto: zuschlagAuto,
    zuschlag_haustier: zuschlagHaustier,
    notgroschen_min: notgroschenMin,
    notgroschen_max: notgroschenMax,
    notgroschen_empf: notgroschenEmpf,
    vorhanden,
    differenz,
    fortschritt_pct: fortschrittPct,
    bewertung,
    fehlbetrag,
    monate_aufbau: monateAufbau,
    sparrate6m,
    sparrate12m,
    sparrate24m,
    sparquote,
    tagesgeld_ertrag: tagesgeldErtrag,
    tagesgeld_tipp: tagesgeldTipp,
  };
}

// ── Nebenjob / Minijob / Midijob Rechner Engine ─────────────────────────
// Abgaben-Saetze 2025 (Minijob-Zentrale)
const MJ_KV_AG = 0.13; // Pauschale KV Arbeitgeber
const MJ_RV_AG = 0.15; // Pauschale RV Arbeitgeber
const MJ_STEUER_AG = 0.02; // Pauschsteuer
const MJ_U1 = 0.011; // Umlage U1
const MJ_U2 = 0.0022; // Umlage U2
const MJ_INSOLVENZ = 0.0006; // Insolvenzgeldumlage
const MJ_RV_AN = 0.036; // RV-Eigenanteil AN (bei RV-Pflicht)

// Minijob-Grenze 2025
const MINIJOB_GRENZE = 556;
// Midijob-Obergrenze
const MIDIJOB_GRENZE = 2000;
// Mindestlohn 2025
const MINDESTLOHN_2025 = 12.82;

// Gleitzonenfaktor F 2025
const GLEIT_F = 0.6847;

// Volle SV-Saetze 2025 (AN-Anteil)
const SV_KV_AN = 0.073; // + Zusatzbeitrag ~0.85%
const SV_KV_ZUSATZ_AN = 0.0085;
const SV_PV_AN = 0.0175; // ohne Kinder: +0.6% Zuschlag
const SV_RV_AN = 0.093;
const SV_ALV_AN = 0.013;

function computeNebenjob(
  v: Record<string, number>,
): Record<string, number | string> {
  const stundenlohn = v.stundenlohn ?? MINDESTLOHN_2025;
  const stundenWoche = v.stunden ?? 10;
  const jobtyp = v.jobtyp ?? 0; // 0=gewerblich, 1=Privathaushalt, 2=Werkstudent
  const rvBefreiung = v.rv_befreiung ?? 1; // 0=RV-pflichtig, 1=befreit
  const hatHauptjob = v.hat_hauptjob ?? 0; // 0=Nein, 1=Ja (Steuerklasse VI)
  const kinderlos = v.kinderlos ?? 1; // 0=hat Kinder, 1=kinderlos (PV-Zuschlag)

  // ── Brutto berechnen ──
  const stundenMonat = stundenWoche * 4.33;
  const bruttoMonat = Math.round(stundenlohn * stundenMonat * 100) / 100;
  const bruttoJahr = Math.round(bruttoMonat * 12 * 100) / 100;

  // ── Jobkategorie bestimmen ──
  let kategorie: string;
  let kategorieDetail: string;

  if (jobtyp === 2) {
    // Werkstudent – Sonderfall
    kategorie = "Werkstudent";
    kategorieDetail = "Werkstudentenprivileg: nur RV-Pflicht, keine KV/PV/ALV";
  } else if (bruttoMonat <= MINIJOB_GRENZE) {
    kategorie = "Minijob";
    kategorieDetail =
      "Bis " + MINIJOB_GRENZE + " EUR/Monat – fuer dich steuerfrei!";
  } else if (bruttoMonat <= MIDIJOB_GRENZE) {
    kategorie = "Midijob (Uebergangsbereich)";
    kategorieDetail =
      bruttoMonat.toFixed(0) +
      " EUR liegt zwischen " +
      MINIJOB_GRENZE +
      " und " +
      MIDIJOB_GRENZE +
      " EUR – reduzierte SV-Beitraege";
  } else {
    kategorie = "Regulaere Beschaeftigung";
    kategorieDetail =
      "Ueber " +
      MIDIJOB_GRENZE +
      " EUR – volle Sozialabgaben und Steuerpflicht";
  }

  // ── Abgaben berechnen ──
  let anRV = 0,
    anKV = 0,
    anPV = 0,
    anALV = 0,
    anSteuer = 0;
  let agRV = 0,
    agKV = 0,
    agSteuer = 0,
    agU1 = 0,
    agU2 = 0,
    agInsolvenz = 0;
  let agGesamt = 0,
    anGesamt = 0;
  let nettoMonat = bruttoMonat;

  if (jobtyp === 2) {
    // ── Werkstudent ──
    anRV = Math.round(bruttoMonat * SV_RV_AN * 100) / 100;
    agRV = Math.round(bruttoMonat * SV_RV_AN * 100) / 100;
    anGesamt = anRV;
    agGesamt = agRV;
    // Werkstudenten zahlen Lohnsteuer wenn ueber Grundfreibetrag
    // Vereinfacht: bei Hauptjob -> Steuerklasse VI (~25% pauschal)
    if (hatHauptjob === 1 && bruttoMonat > 0) {
      // Steuerklasse VI: vereinfacht ~20-25% Lohnsteuer
      anSteuer = Math.round(bruttoMonat * 0.2 * 100) / 100;
      anGesamt += anSteuer;
    }
    nettoMonat = Math.round((bruttoMonat - anGesamt) * 100) / 100;
  } else if (bruttoMonat <= MINIJOB_GRENZE) {
    // ── Minijob ──
    if (jobtyp === 1) {
      // Privathaushalt: niedrigere AG-Pauschalen
      agKV = Math.round(bruttoMonat * 0.05 * 100) / 100;
      agRV = Math.round(bruttoMonat * 0.05 * 100) / 100;
      agSteuer = Math.round(bruttoMonat * 0.02 * 100) / 100;
      agU2 = Math.round(bruttoMonat * MJ_U2 * 100) / 100;
      if (rvBefreiung === 0) {
        anRV = Math.round(bruttoMonat * 0.136 * 100) / 100; // 13,6% Eigenanteil Privathaushalt
      }
    } else {
      // Gewerblich
      agKV = Math.round(bruttoMonat * MJ_KV_AG * 100) / 100;
      agRV = Math.round(bruttoMonat * MJ_RV_AG * 100) / 100;
      agSteuer = Math.round(bruttoMonat * MJ_STEUER_AG * 100) / 100;
      agU1 = Math.round(bruttoMonat * MJ_U1 * 100) / 100;
      agU2 = Math.round(bruttoMonat * MJ_U2 * 100) / 100;
      agInsolvenz = Math.round(bruttoMonat * MJ_INSOLVENZ * 100) / 100;
      if (rvBefreiung === 0) {
        anRV = Math.round(bruttoMonat * MJ_RV_AN * 100) / 100;
      }
    }
    anGesamt = anRV;
    agGesamt = agKV + agRV + agSteuer + agU1 + agU2 + agInsolvenz;
    nettoMonat = Math.round((bruttoMonat - anGesamt) * 100) / 100;
  } else if (bruttoMonat <= MIDIJOB_GRENZE) {
    // ── Midijob (Uebergangsbereich) ──
    // Im Uebergangsbereich steigt der AN-Anteil linear von ~0% bei 556€ auf den
    // vollen Satz bei 2000€. Der AG zahlt immer den vollen Satz auf das volle Brutto.
    // Faktor: 0 an der Untergrenze, 1 an der Obergrenze
    const gleitFaktor =
      (bruttoMonat - MINIJOB_GRENZE) / (MIDIJOB_GRENZE - MINIJOB_GRENZE);

    // Volle AN-Saetze
    const kvAnSatz = SV_KV_AN + SV_KV_ZUSATZ_AN; // ~8,15%
    const pvAnSatz = SV_PV_AN + (kinderlos === 1 ? 0.006 : 0); // 1,75% (+0,6%)
    const rvAnSatz = SV_RV_AN; // 9,3%
    const alvAnSatz = SV_ALV_AN; // 1,3%

    // AN-Beitraege: reduziert durch Gleitfaktor
    anKV = Math.round(bruttoMonat * kvAnSatz * gleitFaktor * 100) / 100;
    anPV = Math.round(bruttoMonat * pvAnSatz * gleitFaktor * 100) / 100;
    anRV = Math.round(bruttoMonat * rvAnSatz * gleitFaktor * 100) / 100;
    anALV = Math.round(bruttoMonat * alvAnSatz * gleitFaktor * 100) / 100;
    anGesamt = anKV + anPV + anRV + anALV;

    // AG zahlt immer den vollen Satz + Umlagen
    agKV = Math.round(bruttoMonat * kvAnSatz * 100) / 100;
    agRV = Math.round(bruttoMonat * rvAnSatz * 100) / 100;
    const agPV = Math.round(bruttoMonat * SV_PV_AN * 100) / 100;
    const agALV = Math.round(bruttoMonat * alvAnSatz * 100) / 100;
    agU1 = Math.round(bruttoMonat * MJ_U1 * 100) / 100;
    agU2 = Math.round(bruttoMonat * MJ_U2 * 100) / 100;
    agInsolvenz = Math.round(bruttoMonat * MJ_INSOLVENZ * 100) / 100;
    agGesamt = agKV + agRV + agPV + agALV + agU1 + agU2 + agInsolvenz;

    // Lohnsteuer bei Hauptjob (Steuerklasse VI)
    if (hatHauptjob === 1) {
      anSteuer = Math.round(bruttoMonat * 0.2 * 100) / 100;
      anGesamt += anSteuer;
    }

    nettoMonat = Math.round((bruttoMonat - anGesamt) * 100) / 100;
  } else {
    // ── Regulaer (> 2000€) ──
    anKV = Math.round(bruttoMonat * (SV_KV_AN + SV_KV_ZUSATZ_AN) * 100) / 100;
    anPV =
      Math.round(
        bruttoMonat * (SV_PV_AN + (kinderlos === 1 ? 0.006 : 0)) * 100,
      ) / 100;
    anRV = Math.round(bruttoMonat * SV_RV_AN * 100) / 100;
    anALV = Math.round(bruttoMonat * SV_ALV_AN * 100) / 100;
    anGesamt = anKV + anPV + anRV + anALV;

    if (hatHauptjob === 1) {
      anSteuer = Math.round(bruttoMonat * 0.25 * 100) / 100;
    }
    anGesamt += anSteuer;

    agKV = Math.round(bruttoMonat * (SV_KV_AN + SV_KV_ZUSATZ_AN) * 100) / 100;
    agRV = Math.round(bruttoMonat * SV_RV_AN * 100) / 100;
    agGesamt =
      agKV +
      agRV +
      Math.round(bruttoMonat * SV_ALV_AN * 100) / 100 +
      Math.round(bruttoMonat * SV_PV_AN * 100) / 100 +
      Math.round(bruttoMonat * MJ_U1 * 100) / 100 +
      Math.round(bruttoMonat * MJ_U2 * 100) / 100;

    nettoMonat = Math.round((bruttoMonat - anGesamt) * 100) / 100;
  }

  const nettoJahr = Math.round(nettoMonat * 12 * 100) / 100;
  const nettoStunde =
    stundenMonat > 0 ? Math.round((nettoMonat / stundenMonat) * 100) / 100 : 0;
  const abgabenQuote =
    bruttoMonat > 0 ? Math.round((anGesamt / bruttoMonat) * 1000) / 10 : 0;

  // ── Maximal moegliche Stunden bei Minijob-Grenze ──
  const maxStundenMinijob =
    stundenlohn > 0
      ? Math.floor((MINIJOB_GRENZE / stundenlohn / 4.33) * 10) / 10
      : 0;

  // ── Bewertung / Tipp ──
  let bewertung: string;
  if (kategorie === "Minijob") {
    if (rvBefreiung === 1) {
      bewertung =
        "Steuerfrei & abgabenfrei – du bekommst 100% netto ausgezahlt!";
    } else {
      bewertung =
        "Steuerfrei, aber " +
        (jobtyp === 1 ? "13,6%" : "3,6%") +
        " RV-Eigenanteil – dafuer Rentenansprueche!";
    }
  } else if (kategorie === "Werkstudent") {
    bewertung =
      hatHauptjob === 1
        ? "Werkstudent mit Hauptjob: RV + Lohnsteuer (StKl. VI) – pruefe ob Minijob guenstiger waere"
        : "Werkstudent: Nur 9,3% RV – sehr guenstig! Achte auf die 20h-Grenze.";
  } else if (kategorie.includes("Midijob")) {
    bewertung =
      "Reduzierte SV-Beitraege in der Gleitzone – ab " +
      (MINIJOB_GRENZE + 1) +
      " EUR lohnt sich mehr arbeiten";
  } else {
    bewertung =
      "Volle Abgaben – pruefe ob ein 2. Minijob beim gleichen AG guenstiger waere";
  }

  // ── Jahres-Steuerfreibetrag Check ──
  const grundfreibetrag = 12096; // 2025
  let steuerHinweis: string;
  if (bruttoJahr <= grundfreibetrag && hatHauptjob === 0) {
    steuerHinweis =
      "Unter dem Grundfreibetrag (" +
      grundfreibetrag +
      " EUR) – keine Einkommensteuer!";
  } else if (hatHauptjob === 1) {
    steuerHinweis =
      "Bei Hauptjob: Nebenjob wird ueber Steuerklasse VI versteuert – Steuererklaerung machen!";
  } else {
    steuerHinweis =
      "Ueber Grundfreibetrag – Lohnsteuer faellt an (ggf. per Steuererklaerung zurueckholen)";
  }

  return {
    brutto_monat: bruttoMonat,
    brutto_jahr: bruttoJahr,
    stunden_monat: Math.round(stundenMonat * 10) / 10,
    kategorie,
    kategorie_detail: kategorieDetail,
    an_rv: anRV,
    an_kv: anKV,
    an_pv: anPV,
    an_alv: anALV,
    an_steuer: anSteuer,
    an_gesamt: Math.round(anGesamt * 100) / 100,
    abgaben_quote: abgabenQuote,
    netto_monat: nettoMonat,
    netto_jahr: nettoJahr,
    netto_stunde: nettoStunde,
    ag_kv: agKV,
    ag_rv: agRV,
    ag_steuer: agSteuer,
    ag_u1: agU1,
    ag_u2: agU2,
    ag_insolvenz: agInsolvenz,
    ag_gesamt: Math.round(agGesamt * 100) / 100,
    ag_total_kosten: Math.round((bruttoMonat + agGesamt) * 100) / 100,
    max_stunden_minijob: maxStundenMinijob,
    bewertung,
    steuer_hinweis: steuerHinweis,
  };
}

// ── BAföG-Rechner Engine (WS 2024/2025) ────────────────────────────────
// Bedarfssaetze
const BAFOEG_GRUNDBEDARF = 475;
const BAFOEG_WOHN_EIGEN = 380; // eigene Wohnung
const BAFOEG_WOHN_ELTERN = 59; // bei Eltern
const BAFOEG_KV_ZUSCHLAG = 102; // eigene KV (ab 25)
const BAFOEG_PV_ZUSCHLAG = 35; // eigene PV (ab 25)

// Freibetraege Elterneinkommen (monatlich)
const BAFOEG_FREI_VERHEIRATET = 2540; // beide Eltern zusammen
const BAFOEG_FREI_ALLEINERZIEHEND = 1690; // pro Elternteil
const BAFOEG_FREI_GESCHWISTER = 770; // pro Geschwister (nicht in foerderfaehiger Ausbildung)

// Eigenes Einkommen
const BAFOEG_FREI_EIGEN = 353; // monatlich
const BAFOEG_WERBUNGSKOSTEN = 1230; // jaehrlich
const BAFOEG_SOZIALPAUSCHALE = 0.223; // 22,3%
const BAFOEG_VERMOEGEN_FREI = 15000;

function computeBafoeg(
  v: Record<string, number>,
): Record<string, number | string> {
  const ausbildungsart = v.ausbildungsart ?? 0; // 0=Studium, 1=Schule (auswärts), 2=Schule (Eltern)
  const wohnsituation = v.wohnsituation ?? 0; // 0=eigene Wohnung, 1=bei Eltern
  const eigenKV = v.eigen_kv ?? 0; // 0=familienversichert, 1=eigene KV
  const elternBrutto = v.eltern_brutto ?? 40000; // Jahresbrutto Eltern
  const elternStatus = v.eltern_status ?? 0; // 0=verheiratet, 1=alleinerziehend/getrennt
  const geschwisterFrei = v.geschwister_frei ?? 0; // Geschwister OHNE foerderfaehige Ausbildung (erhoehen Freibetrag)
  const geschwisterAusb = v.geschwister_ausb ?? 0; // Geschwister IN foerderfaehiger Ausbildung (teilen anrechnung)
  const eigenEinkommen = v.eigen_einkommen ?? 0; // monatliches Bruttoeinkommen
  const vermoegen = v.vermoegen ?? 0;
  const partnerEinkommen = v.partner_einkommen ?? 0; // Ehepartner/eingetragener LP

  // ── 1. Bedarf berechnen ──
  const wohnpauschale =
    wohnsituation === 0 ? BAFOEG_WOHN_EIGEN : BAFOEG_WOHN_ELTERN;
  const kvZuschlag = eigenKV === 1 ? BAFOEG_KV_ZUSCHLAG : 0;
  const pvZuschlag = eigenKV === 1 ? BAFOEG_PV_ZUSCHLAG : 0;
  const gesamtBedarf =
    BAFOEG_GRUNDBEDARF + wohnpauschale + kvZuschlag + pvZuschlag;

  // ── 2. Elterneinkommen anrechnen ──
  // Schritt 1: Brutto -> bereinigtes Netto (jaehrlich)
  const elternNachWK = Math.max(0, elternBrutto - BAFOEG_WERBUNGSKOSTEN);
  const elternNachSozi = Math.round(
    elternNachWK * (1 - BAFOEG_SOZIALPAUSCHALE),
  );
  const elternNettoMonat = Math.round(elternNachSozi / 12);

  // Schritt 2: Freibetraege
  let elternFreibetrag: number;
  if (elternStatus === 0) {
    elternFreibetrag = BAFOEG_FREI_VERHEIRATET;
  } else {
    // Getrennt/alleinerziehend: 1.690€ pro Elternteil
    elternFreibetrag = BAFOEG_FREI_ALLEINERZIEHEND;
  }
  // + Geschwister-Freibetrag (nicht in Ausbildung)
  elternFreibetrag += geschwisterFrei * BAFOEG_FREI_GESCHWISTER;

  // Schritt 3: Ueberhang
  const elternUeberhang = Math.max(0, elternNettoMonat - elternFreibetrag);

  // Schritt 4: Anrechnungssatz: 50% + 5% pro Kind mit Freibetrag
  // Kinder mit Freibetrag = Antragsteller + Geschwister in foerderfaehiger Ausbildung
  const kinderMitAnspruch = 1 + geschwisterAusb;
  const anrechnungsSatz = 0.5 + 0.05 * Math.max(0, kinderMitAnspruch - 1);
  // Nicht ueber 1.0 (theoretisch bei >10 Kindern, aber cap)
  const effAnrechnungsSatz = Math.min(1, anrechnungsSatz);

  const elternAnrechnung = Math.round(elternUeberhang * effAnrechnungsSatz);

  // Bei Geschwistern in Ausbildung: anrechenbarer Betrag wird geteilt
  const elternAnrechnungProKind =
    kinderMitAnspruch > 1
      ? Math.round(elternAnrechnung / kinderMitAnspruch)
      : elternAnrechnung;

  // ── 3. Eigenes Einkommen anrechnen ──
  // Monatlich: Brutto - WK anteilig - Sozialpauschale - Freibetrag
  const eigenWKMonat = Math.round(BAFOEG_WERBUNGSKOSTEN / 12);
  const eigenNachWK = Math.max(0, eigenEinkommen - eigenWKMonat);
  const eigenNachSozi = Math.round(eigenNachWK * (1 - BAFOEG_SOZIALPAUSCHALE));
  const eigenAnrechnung = Math.max(0, eigenNachSozi - BAFOEG_FREI_EIGEN);

  // ── 4. Vermoegen anrechnen ──
  const vermoegenAnrechnung =
    vermoegen > BAFOEG_VERMOEGEN_FREI
      ? Math.round((vermoegen - BAFOEG_VERMOEGEN_FREI) / 12) // auf 12 Monate verteilt
      : 0;

  // ── 5. Partner-Einkommen anrechnen ──
  const partnerNachWK = Math.max(
    0,
    partnerEinkommen * 12 - BAFOEG_WERBUNGSKOSTEN,
  );
  const partnerNachSozi = Math.round(
    (partnerNachWK * (1 - BAFOEG_SOZIALPAUSCHALE)) / 12,
  );
  const partnerFreibetrag = 850; // Ehepartner-Freibetrag
  const partnerAnrechnung = Math.max(0, partnerNachSozi - partnerFreibetrag);

  // ── 6. BAföG berechnen ──
  const gesamtAnrechnung =
    elternAnrechnungProKind +
    eigenAnrechnung +
    vermoegenAnrechnung +
    partnerAnrechnung;
  const bafoegMonat = Math.max(0, gesamtBedarf - gesamtAnrechnung);
  // BAföG-Mindestbetrag: unter 10€ wird nicht gezahlt
  const bafoegEffektiv = bafoegMonat >= 10 ? bafoegMonat : 0;
  const bafoegJahr = bafoegEffektiv * 12;

  // ── 7. Zusammensetzung ──
  const zuschussAnteil = Math.round(bafoegEffektiv * 0.5); // 50% Zuschuss
  const darlehenAnteil = bafoegEffektiv - zuschussAnteil; // 50% Darlehen
  // Max. Rueckzahlung: 10.010€ (gedeckelt)
  const maxRueckzahlung = Math.min(darlehenAnteil * 12 * 5, 10010); // 5 Jahre Regelstudienzeit

  // ── 8. Bewertung ──
  let bewertung: string;
  if (bafoegEffektiv >= gesamtBedarf * 0.9) {
    bewertung = "Fast Hoechstsatz! Du bekommst nahezu den vollen Betrag.";
  } else if (bafoegEffektiv >= gesamtBedarf * 0.5) {
    bewertung = "Gute Foerderung – deckt einen Grossteil deiner Kosten.";
  } else if (bafoegEffektiv > 0) {
    bewertung =
      "Teilfoerderung – ergaenze mit Minijob (bis 556 EUR ohne Kuerzung).";
  } else if (elternNettoMonat <= elternFreibetrag * 1.1) {
    bewertung =
      "Knapp ueber der Grenze – Antrag trotzdem stellen, es kann sich aendern!";
  } else {
    bewertung =
      "Kein Anspruch bei diesem Elterneinkommen. Alternativen: Stipendium, KfW-Studienkredit.";
  }

  // ── Minijob-kompatibel? ──
  const minijobOK =
    eigenEinkommen <= 556
      ? "Ja – Minijob bis 556 EUR/Monat ohne BAfoeg-Kuerzung moeglich"
      : "Achtung: Einkommen ueber 556 EUR wird teilweise angerechnet!";

  // ── Vermoegens-Check ──
  const vermoegenOK =
    vermoegen <= BAFOEG_VERMOEGEN_FREI
      ? "Im Freibetrag (" +
        BAFOEG_VERMOEGEN_FREI.toLocaleString("de-DE") +
        " EUR) – kein Abzug"
      : "Ueber Freibetrag: " +
        Math.round(vermoegen - BAFOEG_VERMOEGEN_FREI).toLocaleString("de-DE") +
        " EUR werden angerechnet";

  return {
    grundbedarf: BAFOEG_GRUNDBEDARF,
    wohnpauschale: wohnpauschale,
    kv_zuschlag: kvZuschlag,
    pv_zuschlag: pvZuschlag,
    gesamt_bedarf: gesamtBedarf,
    eltern_netto_monat: elternNettoMonat,
    eltern_freibetrag: elternFreibetrag,
    eltern_ueberhang: elternUeberhang,
    anrechnungs_satz: Math.round(effAnrechnungsSatz * 100),
    eltern_anrechnung: elternAnrechnungProKind,
    eigen_anrechnung: eigenAnrechnung,
    vermoegen_anrechnung: vermoegenAnrechnung,
    partner_anrechnung: partnerAnrechnung,
    gesamt_anrechnung: gesamtAnrechnung,
    bafoeg_monat: bafoegEffektiv,
    bafoeg_jahr: bafoegJahr,
    zuschuss: zuschussAnteil,
    darlehen: darlehenAnteil,
    max_rueckzahlung: maxRueckzahlung,
    bewertung,
    minijob_check: minijobOK,
    vermoegen_check: vermoegenOK,
  };
}

// ── Stundenlohn-Rechner Engine ──────────────────────────────────────────
// Gesetzliche Feiertage 2025 (bundesweit): 9 Tage
// Bundeslaender mit mehr: Bayern 13, BW 12, Saarland 12, NRW/RLP etc. 11
const FEIERTAGE_BUND: Record<number, number> = {
  0: 9, // bundesweit (Minimum)
  1: 13, // Bayern
  2: 12, // Baden-Wuerttemberg
  3: 11, // NRW
  4: 11, // Niedersachsen
  5: 10, // Berlin
  6: 11, // Hessen
  7: 12, // Saarland
  8: 11, // Sachsen
  9: 11, // Thueringen
  10: 10, // Hamburg
  11: 10, // Bremen
  12: 10, // Schleswig-Holstein
  13: 11, // Rheinland-Pfalz
  14: 11, // Sachsen-Anhalt
  15: 11, // Mecklenburg-Vorpommern
  16: 12, // Brandenburg
};

function computeStundenlohn(
  v: Record<string, number>,
): Record<string, number | string> {
  const monatsgehalt = v.monatsgehalt ?? 3000;
  const wochenstunden = v.wochenstunden ?? 40;
  const urlaubstage = v.urlaubstage ?? 28;
  const bundesland = v.bundesland ?? 0;
  const weihnachtsgeld = v.weihnachtsgeld ?? 0; // in % vom Monatsgehalt (0=kein, 50=halbes, 100=volles)
  const urlaubsgeld = v.urlaubsgeld ?? 0; // absolute EUR
  const bonus = v.bonus ?? 0; // jaehrlich EUR
  const arbeitstageWoche = v.arbeitstage ?? 5; // 5 oder 6 Tage

  const feiertage = FEIERTAGE_BUND[bundesland] ?? 9;

  // ── Jahresgehalt inkl. Sonderzahlungen ──
  const jahresgehaltOhne = monatsgehalt * 12;
  const weihnachtsgeldBetrag = monatsgehalt * (weihnachtsgeld / 100);
  const sonderzahlungen = weihnachtsgeldBetrag + urlaubsgeld + bonus;
  const jahresgehaltMit = jahresgehaltOhne + sonderzahlungen;

  // ── Arbeitstage & Arbeitsstunden pro Jahr ──
  // Kalenderwochen: 52,14
  const arbeitstageJahrBrutto = Math.round(52.14 * arbeitstageWoche);
  // Davon abziehen: Urlaubstage + Feiertage (die auf Arbeitstage fallen, ca. 70% bei 5-Tage-Woche)
  const feiertagArbeitstage = Math.round(feiertage * (arbeitstageWoche / 7));
  const arbeitstageJahrNetto =
    arbeitstageJahrBrutto - urlaubstage - feiertagArbeitstage;
  const stundenProTag = wochenstunden / arbeitstageWoche;
  const arbeitsstundenJahr = Math.round(arbeitstageJahrNetto * stundenProTag);
  const arbeitsstundenJahrBrutto = Math.round(
    arbeitstageJahrBrutto * stundenProTag,
  );

  // ── Stundenlohn-Varianten ──
  // Formaler Stundenlohn (ohne Urlaub/Feiertage)
  const stundenlohnFormal =
    wochenstunden > 0
      ? Math.round((monatsgehalt / (wochenstunden * 4.33)) * 100) / 100
      : 0;

  // Effektiver Stundenlohn (Jahresgehalt OHNE Sonderzahlungen / tatsächliche Arbeitsstunden)
  const stundenlohnEffektiv =
    arbeitsstundenJahr > 0
      ? Math.round((jahresgehaltOhne / arbeitsstundenJahr) * 100) / 100
      : 0;

  // Effektiver Stundenlohn MIT Sonderzahlungen
  const stundenlohnMitSonder =
    arbeitsstundenJahr > 0
      ? Math.round((jahresgehaltMit / arbeitsstundenJahr) * 100) / 100
      : 0;

  // ── Tages- und Wochenverdienst ──
  const tagesverdienst =
    stundenProTag > 0
      ? Math.round(stundenlohnFormal * stundenProTag * 100) / 100
      : 0;
  const wochenverdienst =
    Math.round(stundenlohnFormal * wochenstunden * 100) / 100;

  // ── Mindestlohn-Check (2025: 12,82€) ──
  const mindestlohn = 12.82;
  let mindestlohnCheck: string;
  if (stundenlohnFormal >= mindestlohn * 1.5) {
    mindestlohnCheck =
      "Deutlich ueber Mindestlohn (" + mindestlohn + " EUR) – gut!";
  } else if (stundenlohnFormal >= mindestlohn) {
    mindestlohnCheck =
      "Ueber Mindestlohn (" + mindestlohn + " EUR) – aber wenig Puffer";
  } else if (stundenlohnFormal > 0) {
    mindestlohnCheck =
      "ACHTUNG: Unter dem gesetzlichen Mindestlohn von " +
      mindestlohn +
      " EUR!";
  } else {
    mindestlohnCheck = "Kein Gehalt angegeben";
  }

  // ── Vergleich: Was bringen Sonderzahlungen pro Stunde? ──
  const sonderProStunde =
    arbeitsstundenJahr > 0
      ? Math.round((sonderzahlungen / arbeitsstundenJahr) * 100) / 100
      : 0;

  // ── Arbeitszeitanalyse ──
  const jahresarbeitszeitStd = arbeitsstundenJahrBrutto;
  const freizeitEffekt = arbeitsstundenJahrBrutto - arbeitsstundenJahr;

  // ── Bewertung ──
  let bewertung: string;
  const differenz = stundenlohnMitSonder - stundenlohnFormal;
  if (differenz > 5) {
    bewertung =
      "Sonderzahlungen & Freizeit erhoehen deinen echten Stundenlohn um " +
      differenz.toFixed(2) +
      " EUR!";
  } else if (differenz > 1) {
    bewertung =
      "Dein effektiver Stundenlohn ist " +
      differenz.toFixed(2) +
      " EUR hoeher als der formale.";
  } else {
    bewertung =
      "Kaum Unterschied – keine/wenige Sonderzahlungen oder wenig Urlaub/Feiertage.";
  }

  return {
    stundenlohn_formal: stundenlohnFormal,
    stundenlohn_effektiv: stundenlohnEffektiv,
    stundenlohn_mit_sonder: stundenlohnMitSonder,
    tagesverdienst,
    wochenverdienst,
    monatsgehalt_out: monatsgehalt,
    jahresgehalt_ohne: jahresgehaltOhne,
    jahresgehalt_mit: jahresgehaltMit,
    sonderzahlungen,
    weihnachtsgeld_betrag: weihnachtsgeldBetrag,
    arbeitstage_brutto: arbeitstageJahrBrutto,
    urlaubstage_out: urlaubstage,
    feiertage,
    feiertage_arbeitstage: feiertagArbeitstage,
    arbeitstage_netto: arbeitstageJahrNetto,
    arbeitsstunden_jahr: arbeitsstundenJahr,
    stunden_pro_tag: Math.round(stundenProTag * 100) / 100,
    freizeit_stunden: freizeitEffekt,
    sonder_pro_stunde: sonderProStunde,
    mindestlohn_check: mindestlohnCheck,
    bewertung,
  };
}

// ── Spritrechner Engine ─────────────────────────────────────────────────
// CO2-Emissionen pro Liter (kg CO2)
const CO2_BENZIN = 2.37; // kg CO2 pro Liter Benzin
const CO2_DIESEL = 2.65; // kg CO2 pro Liter Diesel
const CO2_STROM = 0.38; // kg CO2 pro kWh (DE-Strommix 2025)

// Pendlerpauschale 2025
const PENDLER_BIS20 = 0.3; // €/km bis 20km
const PENDLER_AB21 = 0.38; // €/km ab 21km

// Deutschlandticket 2025
const DTICKET_PREIS = 58; // €/Monat (2025)

function computeSprit(
  v: Record<string, number>,
): Record<string, number | string> {
  const strecke = v.strecke ?? 25; // km einfach
  const kraftstoff = v.kraftstoff ?? 0; // 0=Benzin, 1=Diesel, 2=E-Auto, 3=Hybrid
  const verbrauch = v.verbrauch ?? 7; // l/100km oder kWh/100km bei E-Auto
  const spritpreis = v.spritpreis ?? 1.75; // €/Liter oder €/kWh
  const fahrtenWoche = v.fahrten ?? 10; // Hin+Rueck-Fahrten pro Woche
  const mitfahrer = v.mitfahrer ?? 0; // Anzahl Mitfahrer (Kosten teilen)
  const istPendler = v.ist_pendler ?? 1; // 0=Nein, 1=Ja (Pendlerpauschale berechnen)
  const steuersatz = v.steuersatz ?? 30; // Grenzsteuersatz in %

  // ── Kraftstoff-Label ──
  const kraftstoffLabel =
    ["Benzin", "Diesel", "E-Auto (Strom)", "Hybrid"][kraftstoff] ?? "Benzin";
  const einheit = kraftstoff === 2 ? "kWh/100km" : "l/100km";
  const preisEinheit = kraftstoff === 2 ? "EUR/kWh" : "EUR/Liter";

  // ── Kosten pro Fahrt ──
  const verbrauchProFahrt = (strecke * verbrauch) / 100;
  const kostenProFahrt = Math.round(verbrauchProFahrt * spritpreis * 100) / 100;

  // ── Kosten pro km ──
  const kostenProKm = Math.round((verbrauch / 100) * spritpreis * 100) / 100;

  // ── Zeitraeume ──
  const kostenWoche = Math.round(kostenProFahrt * fahrtenWoche * 100) / 100;
  const kostenMonat = Math.round(kostenWoche * 4.33 * 100) / 100;
  const kostenJahr = Math.round(kostenWoche * 52 * 100) / 100;

  // ── Mitfahrer-Aufteilung ──
  const personenGesamt = 1 + mitfahrer;
  const kostenProPerson =
    Math.round((kostenMonat / personenGesamt) * 100) / 100;
  const ersparnisMitfahrer =
    Math.round((kostenMonat - kostenProPerson) * 100) / 100;

  // ── Verbrauch pro Fahrt ──
  const verbrauchEinheit = kraftstoff === 2 ? "kWh" : "Liter";

  // ── CO2-Emissionen ──
  let co2ProKm: number;
  if (kraftstoff === 0) co2ProKm = (verbrauch / 100) * CO2_BENZIN;
  else if (kraftstoff === 1) co2ProKm = (verbrauch / 100) * CO2_DIESEL;
  else if (kraftstoff === 2) co2ProKm = (verbrauch / 100) * CO2_STROM;
  else co2ProKm = (verbrauch / 100) * CO2_BENZIN * 0.7; // Hybrid ~30% weniger
  const co2ProFahrt = Math.round(co2ProKm * strecke * 100) / 100;
  const co2ProJahr = Math.round(co2ProKm * strecke * fahrtenWoche * 52);

  // ── Pendlerpauschale (nur einfache Strecke, nur Arbeitstage) ──
  let pendlerJahr = 0;
  let pendlerErsparnis = 0;
  let pendlerText = "Nicht berechnet";
  if (istPendler === 1) {
    const arbeitstage = 220; // Durchschnitt
    // Bis 20km: 0,30€, ab 21km: 0,38€
    if (strecke <= 20) {
      pendlerJahr = Math.round(strecke * PENDLER_BIS20 * arbeitstage);
    } else {
      pendlerJahr = Math.round(
        (20 * PENDLER_BIS20 + (strecke - 20) * PENDLER_AB21) * arbeitstage,
      );
    }
    // Steuerersparnis = Pendlerpauschale × Grenzsteuersatz
    pendlerErsparnis = Math.round(pendlerJahr * (steuersatz / 100));
    pendlerText =
      pendlerErsparnis +
      " EUR Steuerersparnis pro Jahr (bei " +
      steuersatz +
      "% Grenzsteuersatz)";
  }

  // ── Vergleich mit Deutschlandticket ──
  const dticketJahr = DTICKET_PREIS * 12;
  const diffDticket = kostenJahr - dticketJahr;
  let dticketVergleich: string;
  if (diffDticket > 500) {
    dticketVergleich =
      "Deutschlandticket spart " +
      Math.round(diffDticket) +
      " EUR/Jahr – deutlich guenstiger!";
  } else if (diffDticket > 0) {
    dticketVergleich =
      "Deutschlandticket spart " +
      Math.round(diffDticket) +
      " EUR/Jahr – lohnt sich, wenn OEPNV moeglich";
  } else {
    dticketVergleich =
      "Auto ist guenstiger als Deutschlandticket (" +
      dticketJahr +
      " EUR/Jahr)";
  }

  // ── Kosten ohne vs. mit Pendlerpauschale ──
  const realKostenJahr = kostenJahr - pendlerErsparnis;

  // ── Bewertung ──
  let bewertung: string;
  if (kostenProKm <= 0.05) {
    bewertung =
      "Sehr guenstig! E-Auto oder sparsamer Verbrauch zahlt sich aus.";
  } else if (kostenProKm <= 0.1) {
    bewertung = "Guter Verbrauch – moderate Kosten pro Kilometer.";
  } else if (kostenProKm <= 0.15) {
    bewertung =
      "Durchschnittliche Kosten – Einsparpotenzial durch Fahrweise und Reifendruck.";
  } else {
    bewertung =
      "Hohe Kosten pro km – pruefe Verbrauch, Fahrgemeinschaft oder Alternative.";
  }

  return {
    kraftstoff_label: kraftstoffLabel,
    kosten_pro_fahrt: kostenProFahrt,
    kosten_pro_km: kostenProKm,
    verbrauch_pro_fahrt: Math.round(verbrauchProFahrt * 100) / 100,
    verbrauch_einheit: verbrauchEinheit,
    kosten_woche: kostenWoche,
    kosten_monat: kostenMonat,
    kosten_jahr: kostenJahr,
    real_kosten_jahr: realKostenJahr,
    personen_gesamt: personenGesamt,
    kosten_pro_person: kostenProPerson,
    ersparnis_mitfahrer: ersparnisMitfahrer,
    co2_pro_fahrt: co2ProFahrt,
    co2_pro_jahr: co2ProJahr,
    pendler_jahr: pendlerJahr,
    pendler_ersparnis: pendlerErsparnis,
    pendler_text: pendlerText,
    dticket_jahr: dticketJahr,
    diff_dticket: Math.round(diffDticket),
    dticket_vergleich: dticketVergleich,
    bewertung,
  };
}

// ── Inflationsrechner ───────────────────────────────────────────────
// Historische Durchschnittsinflation Deutschland (Statistisches Bundesamt)
const INFLATION_HISTORISCH: Record<string, number> = {
  "2015": 0.3,
  "2016": 0.5,
  "2017": 1.5,
  "2018": 1.8,
  "2019": 1.4,
  "2020": 0.5,
  "2021": 3.1,
  "2022": 6.9,
  "2023": 5.9,
  "2024": 2.2,
  "2025": 2.3,
};
const INFLATION_SCHNITT_10J = 2.5; // Ø 2015–2024
const INFLATION_SCHNITT_5J = 3.7; // Ø 2020–2024 (inkl. Krisenjahre)
const EZB_ZIEL = 2.0;

// Warenkorb-Beispiele: typische Kosten für junge Menschen (2025)
const WARENKORB_POSTEN = [
  { name: "Döner / Kebab", preis: 7.5 },
  { name: "Kaffee to go", preis: 3.8 },
  { name: "Club-Eintritt", preis: 15 },
  { name: "Netflix Standard", preis: 13.99 },
  { name: "Spotify Premium", preis: 10.99 },
  { name: "Deutschlandticket", preis: 58 },
  { name: "Kinoticket", preis: 13 },
  { name: "Fitnessstudio/Monat", preis: 30 },
  { name: "1 kg Nudeln", preis: 1.49 },
  { name: "1 Liter Milch", preis: 1.19 },
];

/** ETF-Kostenrechner — Vergleich günstiger ETF vs. teurer Fonds */
function computeETFKosten(
  v: Record<string, number>,
): Record<string, number | string> {
  const anfangskapital = v.anfangskapital ?? 0;
  const sparrate = v.sparrate ?? 100;
  const jahre = v.jahre ?? 30;
  const renditeBrutto = v.rendite ?? 7;
  const terGuenstig = v.ter_guenstig ?? 0.2;
  const terTeuer = v.ter_teuer ?? 1.5;

  const nMonths = Math.round(jahre * 12);
  const einzahlungen = anfangskapital + sparrate * nMonths;

  // Berechne Endvermögen für ein Szenario
  const calcFV = (ter: number): number => {
    const renditeNetto = renditeBrutto - ter;
    const rMonat = renditeNetto / 100 / 12;
    if (rMonat <= 0) return einzahlungen;
    const fvAnfang = anfangskapital * Math.pow(1 + rMonat, nMonths);
    const fvSparplan =
      sparrate * ((Math.pow(1 + rMonat, nMonths) - 1) / rMonat);
    return fvAnfang + fvSparplan;
  };

  const fvGuenstig = calcFV(terGuenstig);
  const fvTeuer = calcFV(terTeuer);
  const fvOhne = calcFV(0); // Ohne jegliche Kosten (theoretisches Maximum)

  // Kosten = entgangene Rendite durch TER
  const kostenGuenstig = fvOhne - fvGuenstig;
  const kostenTeuer = fvOhne - fvTeuer;
  const mehrkosten = fvGuenstig - fvTeuer;

  // Rendite/Gewinn
  const gewinnGuenstig = fvGuenstig - einzahlungen;
  const gewinnTeuer = fvTeuer - einzahlungen;

  // Prozentuale Ersparnis
  const ersparnisProzent =
    fvTeuer > 0 ? ((fvGuenstig - fvTeuer) / fvTeuer) * 100 : 0;

  // Kosten pro Jahr (Durchschnitt)
  const kostenProJahrGuenstig = jahre > 0 ? kostenGuenstig / jahre : 0;
  const kostenProJahrTeuer = jahre > 0 ? kostenTeuer / jahre : 0;

  // TER-Differenz
  const terDifferenz = terTeuer - terGuenstig;

  const rd = (x: number) => Math.round(x * 100) / 100;

  return {
    fv_guenstig: rd(fvGuenstig),
    fv_teuer: rd(fvTeuer),
    fv_ohne: rd(fvOhne),
    einzahlungen: rd(einzahlungen),
    gewinn_guenstig: rd(gewinnGuenstig),
    gewinn_teuer: rd(gewinnTeuer),
    kosten_guenstig: rd(kostenGuenstig),
    kosten_teuer: rd(kostenTeuer),
    mehrkosten: rd(mehrkosten),
    ersparnis_prozent: `${ersparnisProzent.toFixed(1)} %`,
    kosten_pro_jahr_guenstig: rd(kostenProJahrGuenstig),
    kosten_pro_jahr_teuer: rd(kostenProJahrTeuer),
    ter_differenz: `${terDifferenz.toFixed(2)} %`,
  };
}

/** Währungsrechner — Umrechnung mit Wechselkurs und Gebühren */
function computeWaehrung(
  v: Record<string, number>,
): Record<string, number | string> {
  const betrag = v.betrag ?? 100;
  const kurs = v.kurs ?? 1.08;
  const gebuehr = v.gebuehr ?? 1.5;

  const rd = (x: number) => parseFloat(x.toFixed(2));

  const betragFremdwaehrungOhneGebuehr = rd(betrag * kurs);
  const wechselgebuehr = rd((betrag * gebuehr) / 100);
  const betragNachGebuehr = rd((betrag - wechselgebuehr) * kurs);

  return {
    betrag_fremdwaehrung_ohne_gebuehr: betragFremdwaehrungOhneGebuehr,
    wechselgebuehr: wechselgebuehr,
    betrag_nach_gebuehr: betragNachGebuehr,
  };
}

/** Rentenlücken-Rechner — Inflation, Sparrate, Vermögensbedarf */
function computeRentenluecke(
  v: Record<string, number>,
): Record<string, number | string> {
  const alter = v.alter ?? 25;
  const renteneintritt = v.renteneintritt ?? 67;
  const netto = v.netto ?? 2500;
  const wunschrenteAnteil = v.wunschrente ?? 80;
  const gesetzlicheRente = v.gesetzliche_rente ?? 1200;
  const privateVorsorge = v.private_vorsorge ?? 0;
  const vorhandenesVermoegen = v.vorhandenes_vermoegen ?? 0;
  const inflationsrate = v.inflation ?? 2.0;
  const renditePA = v.rendite ?? 6.0;
  const rentendauer = v.rentendauer ?? 20;

  const jahreBisRente = Math.max(1, renteneintritt - alter);

  // Gewünschtes Einkommen im Alter (heute)
  const wunschrenteHeute = netto * (wunschrenteAnteil / 100);

  // Rentenlücke heute (monatlich)
  const lueckeHeuteMonat = Math.max(
    0,
    wunschrenteHeute - gesetzlicheRente - privateVorsorge,
  );
  const lueckeHeuteJahr = lueckeHeuteMonat * 12;

  // Inflationsbereinigung: Kaufkraft bei Renteneintritt
  const inflFaktor = Math.pow(1 + inflationsrate / 100, jahreBisRente);
  const wunschrenteReal = wunschrenteHeute * inflFaktor;
  const gesetzlicheRenteReal = gesetzlicheRente * inflFaktor;
  const privateVorsorgeReal = privateVorsorge * inflFaktor;
  const lueckeRealMonat = Math.max(
    0,
    wunschrenteReal - gesetzlicheRenteReal - privateVorsorgeReal,
  );

  // Benötigtes Vermögen bei Renteneintritt (Kapitalverzehr über rentendauer)
  // Formel: PMT × ((1 - (1+r)^-n) / r) wobei r = reale Rendite (nach Inflation) pro Monat
  const realRenditeJahr = Math.max(
    0.001,
    (1 + renditePA / 100) / (1 + inflationsrate / 100) - 1,
  );
  const rMonat = realRenditeJahr / 12;
  const monate = rentendauer * 12;
  let benoetigtesVermoegen: number;
  if (rMonat > 0.0001) {
    benoetigtesVermoegen =
      lueckeRealMonat * ((1 - Math.pow(1 + rMonat, -monate)) / rMonat);
  } else {
    benoetigtesVermoegen = lueckeRealMonat * monate;
  }

  // Vorhandenes Vermögen bis Renteneintritt hochgerechnet
  const vermoegenBeiRente =
    vorhandenesVermoegen * Math.pow(1 + renditePA / 100, jahreBisRente);

  // Noch aufzubauendes Vermögen
  const nochAufzubauen = Math.max(0, benoetigtesVermoegen - vermoegenBeiRente);

  // Monatliche Sparrate um Lücke zu schließen (Annuitätenformel)
  const rSpar = renditePA / 100 / 12;
  const nSpar = jahreBisRente * 12;
  let sparrateMonat: number;
  if (rSpar > 0.0001 && nSpar > 0) {
    sparrateMonat = nochAufzubauen / ((Math.pow(1 + rSpar, nSpar) - 1) / rSpar);
  } else {
    sparrateMonat = nSpar > 0 ? nochAufzubauen / nSpar : 0;
  }

  // Gesamte Lücke über Rentendauer (nominal)
  const gesamteLuecke = lueckeRealMonat * 12 * rentendauer;

  const rd = (x: number) => Math.round(x * 100) / 100;

  return {
    wunschrente_heute: rd(wunschrenteHeute),
    gesetzliche_rente_out: rd(gesetzlicheRente),
    private_vorsorge_out: rd(privateVorsorge),
    luecke_heute_monat: rd(lueckeHeuteMonat),
    luecke_heute_jahr: rd(lueckeHeuteJahr),
    luecke_real_monat: rd(lueckeRealMonat),
    luecke_real_jahr: rd(lueckeRealMonat * 12),
    benoetigtes_vermoegen: rd(benoetigtesVermoegen),
    vorhandenes_vermoegen_rente: rd(vermoegenBeiRente),
    noch_aufzubauen: rd(nochAufzubauen),
    sparrate_monat: rd(sparrateMonat),
    sparrate_jahr: rd(sparrateMonat * 12),
    gesamte_luecke: rd(gesamteLuecke),
    jahre_bis_rente: jahreBisRente,
    inflationsfaktor: `${((inflFaktor - 1) * 100).toFixed(1)} %`,
  };
}

function computeInflation(
  values: Record<string, number>,
): Record<string, number | string> {
  const betrag = values.betrag ?? 10000;
  const inflationsrate = values.inflationsrate ?? 2.5;
  const jahre = values.jahre ?? 10;
  const zinssatz = values.zinssatz ?? 0; // Sparbuch / Tagesgeld
  const sparrate = values.sparrate ?? 0; // monatliche Sparrate
  const gehalt = values.gehalt ?? 0; // Brutto-Monatsgehalt
  const gehaltsErhoehung = values.gehaltserhoehung ?? 2.0; // jährliche Gehaltserhöhung in %
  const modus = values.modus ?? 0; // 0 = Zukunft, 1 = Vergangenheit

  const r = inflationsrate / 100;
  const z = zinssatz / 100;
  const realzins = (1 + z) / (1 + r) - 1;

  // ── Kaufkraft-Berechnung ──────────────────────────────────────
  const kaufkraftFaktor = 1 / Math.pow(1 + r, jahre);
  const kaufkraftZukunft = betrag * kaufkraftFaktor;
  const kaufkraftVerlust = betrag - kaufkraftZukunft;
  const kaufkraftVerlustProzent = (1 - kaufkraftFaktor) * 100;

  // Wie viel muss man in X Jahren haben, um gleiche Kaufkraft zu haben?
  const noetigerBetrag = betrag * Math.pow(1 + r, jahre);

  // ── Nominalwert mit Zinsen vs. Inflation ──────────────────────
  const nominalMitZinsen = betrag * Math.pow(1 + z, jahre);
  const realwertMitZinsen = nominalMitZinsen * kaufkraftFaktor;
  const realerGewinnVerlust = realwertMitZinsen - betrag;

  // ── Sparplan: Nominal vs. Real ────────────────────────────────
  let sparplanNominal = 0;
  let sparplanReal = 0;
  let sparplanEingezahlt = 0;
  if (sparrate > 0) {
    sparplanEingezahlt = sparrate * 12 * jahre;
    // FV of annuity nominal
    if (z > 0) {
      sparplanNominal = sparrate * 12 * ((Math.pow(1 + z, jahre) - 1) / z);
    } else {
      sparplanNominal = sparplanEingezahlt;
    }
    sparplanReal = sparplanNominal / Math.pow(1 + r, jahre);
  }

  // ── Gehalt-Analyse ────────────────────────────────────────────
  let gehaltHeute = gehalt;
  let gehaltZukunftNominal = 0;
  let gehaltZukunftReal = 0;
  let gehaltKaufkraftVerlustMonat = 0;
  let gehaltKaufkraftVerlustJahr = 0;
  let gehaltText = "";
  if (gehalt > 0) {
    const gE = gehaltsErhoehung / 100;
    gehaltZukunftNominal = gehalt * Math.pow(1 + gE, jahre);
    gehaltZukunftReal = gehaltZukunftNominal / Math.pow(1 + r, jahre);
    gehaltKaufkraftVerlustMonat = gehaltHeute - gehaltZukunftReal;
    gehaltKaufkraftVerlustJahr = gehaltKaufkraftVerlustMonat * 12;

    if (gE > r) {
      gehaltText = `Gute Nachricht: Deine Gehaltserhöhung (${gehaltsErhoehung}%) liegt über der Inflation (${inflationsrate}%). In ${jahre} Jahren hast du real ca. ${Math.round(gehaltZukunftReal - gehaltHeute)}€/Monat mehr Kaufkraft.`;
    } else if (gE === r) {
      gehaltText = `Deine Gehaltserhöhung gleicht die Inflation genau aus – du hältst deine Kaufkraft, gewinnst aber nichts dazu.`;
    } else {
      gehaltText = `Achtung: Deine Gehaltserhöhung (${gehaltsErhoehung}%) liegt unter der Inflation (${inflationsrate}%). Obwohl du nominal ${Math.round(gehaltZukunftNominal)}€ verdienst, hast du real nur noch die Kaufkraft von ${Math.round(gehaltZukunftReal)}€ heute – ein Verlust von ${Math.round(Math.abs(gehaltKaufkraftVerlustMonat))}€/Monat.`;
    }
  }

  // ── Warenkorb-Projektion ──────────────────────────────────────
  const warenkorbZukunft = WARENKORB_POSTEN.map((p) => ({
    name: p.name,
    heute: p.preis,
    zukunft: p.preis * Math.pow(1 + r, jahre),
  }));
  // Zeige die Top-5 mit dem höchsten absoluten Preisanstieg
  const topWaren = [...warenkorbZukunft]
    .sort((a, b) => b.zukunft - b.heute - (a.zukunft - a.heute))
    .slice(0, 5);
  const warenkorbText = topWaren
    .map(
      (w) =>
        `${w.name}: ${w.heute.toFixed(2)}€ → ${w.zukunft.toFixed(2)}€ (+${(w.zukunft - w.heute).toFixed(2)}€)`,
    )
    .join(" | ");

  // ── Historische Inflation ─────────────────────────────────────
  const histJahre = Object.keys(INFLATION_HISTORISCH).sort();
  const histText = histJahre
    .map((j) => `${j}: ${INFLATION_HISTORISCH[j]}%`)
    .join(" | ");

  // ── Verdopplungszeit (Rule of 72) ─────────────────────────────
  const verdopplungInflation = inflationsrate > 0 ? 72 / inflationsrate : 999;
  const halbierungKaufkraft = verdopplungInflation; // gleiche Formel

  // ── Zeitachse: Kaufkraft pro Jahr ─────────────────────────────
  const zeitachseArr: string[] = [];
  const schritte = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];
  for (const j of schritte) {
    if (j > jahre) break;
    const kk = betrag / Math.pow(1 + r, j);
    const verlust = (1 - 1 / Math.pow(1 + r, j)) * 100;
    zeitachseArr.push(
      `${j}J: ${Math.round(kk).toLocaleString("de-DE")}€ (−${verlust.toFixed(1)}%)`,
    );
  }
  const zeitachseText = zeitachseArr.join(" | ");

  // ── Bewertung ─────────────────────────────────────────────────
  let bewertung = "";
  if (zinssatz === 0 && sparrate === 0) {
    bewertung = `Ohne Zinsen verliert dein Geld in ${jahre} Jahren ${kaufkraftVerlustProzent.toFixed(1)}% seiner Kaufkraft. ${betrag.toLocaleString("de-DE")}€ haben dann nur noch die Kaufkraft von ${Math.round(kaufkraftZukunft).toLocaleString("de-DE")}€ heute. Tipp: Schon ein Tagesgeldkonto mit 2–3% bremst den Verlust.`;
  } else if (realzins < 0) {
    bewertung = `Dein Zinssatz (${zinssatz}%) liegt unter der Inflation (${inflationsrate}%). Real verlierst du trotz Zinsen ${Math.abs(realerGewinnVerlust).toFixed(0)}€ an Kaufkraft. Alternativen: Breit gestreute ETFs erzielen historisch ~7% p.a. und schlagen die Inflation deutlich.`;
  } else if (realzins >= 0 && realzins < 0.02) {
    bewertung = `Dein Zinssatz gleicht die Inflation ungefähr aus – du verlierst kaum Kaufkraft, gewinnst aber auch nichts. Für echten Vermögensaufbau brauchst du eine höhere Rendite, z.B. durch ETFs oder Aktien.`;
  } else {
    bewertung = `Dein Zinssatz (${zinssatz}%) schlägt die Inflation (${inflationsrate}%) deutlich. Real gewinnst du ${realerGewinnVerlust.toFixed(0)}€ an Kaufkraft – so baust du echtes Vermögen auf!`;
  }

  // Extra-Tipp für junge Zielgruppe
  const tippJung = `💡 Als junger Mensch ist Zeit dein größter Vorteil: Wer mit 18 anfängt, 50€/Monat in einen ETF zu investieren, hat mit 60 bei 7% Rendite ca. ${Math.round(50 * 12 * ((Math.pow(1.07, 42) - 1) / 0.07)).toLocaleString("de-DE")}€ – trotz Inflation real deutlich mehr als auf dem Sparbuch.`;

  const fmt = (n: number) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return {
    // Kaufkraft
    kaufkraft_zukunft: `${fmt(kaufkraftZukunft)} €`,
    kaufkraft_verlust_euro: `${fmt(kaufkraftVerlust)} €`,
    kaufkraft_verlust_prozent: `${(Math.round(kaufkraftVerlustProzent * 10) / 10).toLocaleString("de-DE")} %`,
    noetiger_betrag: `${fmt(noetigerBetrag)} €`,

    // Zeitachse
    zeitachse: zeitachseText,

    // Verdopplung/Halbierung
    halbierung_kaufkraft: `${(Math.round(halbierungKaufkraft * 10) / 10).toLocaleString("de-DE")} Jahre`,

    // Zinsen vs. Inflation
    realzins: `${(Math.round(realzins * 10000) / 100).toLocaleString("de-DE")} %`,
    nominal_mit_zinsen: `${fmt(nominalMitZinsen)} €`,
    realwert_mit_zinsen: `${fmt(realwertMitZinsen)} €`,
    realer_gewinn_verlust: `${realerGewinnVerlust >= 0 ? "+" : ""}${fmt(realerGewinnVerlust)} €`,

    // Sparplan
    sparplan_eingezahlt: sparrate > 0 ? `${fmt(sparplanEingezahlt)} €` : "–",
    sparplan_nominal: sparrate > 0 ? `${fmt(sparplanNominal)} €` : "–",
    sparplan_real: sparrate > 0 ? `${fmt(sparplanReal)} €` : "–",
    sparplan_verlust:
      sparrate > 0 ? `${fmt(sparplanEingezahlt - sparplanReal)} €` : "–",

    // Gehalt
    gehalt_zukunft_nominal: gehalt > 0 ? `${fmt(gehaltZukunftNominal)} €` : "–",
    gehalt_zukunft_real: gehalt > 0 ? `${fmt(gehaltZukunftReal)} €` : "–",
    gehalt_kaufkraft_verlust_monat:
      gehalt > 0 ? `${fmt(Math.abs(gehaltKaufkraftVerlustMonat))} €` : "–",
    gehalt_kaufkraft_verlust_jahr:
      gehalt > 0 ? `${fmt(Math.abs(gehaltKaufkraftVerlustJahr))} €` : "–",
    gehalt_text:
      gehalt > 0
        ? gehaltText
        : "Gib dein Brutto-Monatsgehalt ein, um die Gehalts-Analyse zu sehen.",

    // Warenkorb
    warenkorb_text: warenkorbText,

    // Historie
    hist_text: histText,
    schnitt_10j: `${INFLATION_SCHNITT_10J} %`,
    schnitt_5j: `${INFLATION_SCHNITT_5J} %`,
    ezb_ziel: `${EZB_ZIEL} %`,

    // Bewertung
    bewertung,
    tipp_jung: tippJung,
  };
}

export const CALCULATORS: Calculator[] = [
  {
    slug: "brutto-netto-rechner",
    title: "Brutto-Netto-Rechner",
    excerpt:
      "Wie viel bleibt dir nach Steuern und Abgaben wirklich vom Gehalt? Mit Steuerklasse, Bundesland und allen Abzuegen.",
    category: "Gehalt & Arbeit",
    categoryEmoji: "💼",
    computeAll: computeBruttoNetto,
    fields: [
      {
        id: "brutto",
        label: "Brutto-Gehalt (monatlich)",
        suffix: "€",
        defaultValue: 2500,
        min: 450,
        max: 15000,
        step: 50,
      },
      {
        id: "steuerklasse",
        label: "Steuerklasse",
        type: "select",
        defaultValue: 1,
        options: [
          { value: 1, label: "I" },
          { value: 2, label: "II – Alleinerziehend" },
          { value: 3, label: "III – Verheiratet (Alleinverdiener)" },
          { value: 4, label: "IV – Verheiratet (Doppelverdiener)" },
          { value: 5, label: "V – Verheiratet (Geringverdiener)" },
          { value: 6, label: "VI – Zweitjob" },
        ],
      },
      {
        id: "bundesland",
        label: "Bundesland",
        type: "select",
        defaultValue: 10,
        options: [
          { value: 1, label: "Baden-Wuerttemberg" },
          { value: 2, label: "Bayern" },
          { value: 3, label: "Berlin" },
          { value: 4, label: "Brandenburg" },
          { value: 5, label: "Bremen" },
          { value: 6, label: "Hamburg" },
          { value: 7, label: "Hessen" },
          { value: 8, label: "Mecklenburg-Vorpommern" },
          { value: 9, label: "Niedersachsen" },
          { value: 10, label: "Nordrhein-Westfalen" },
          { value: 11, label: "Rheinland-Pfalz" },
          { value: 12, label: "Saarland" },
          { value: 13, label: "Sachsen" },
          { value: 14, label: "Sachsen-Anhalt" },
          { value: 15, label: "Schleswig-Holstein" },
          { value: 16, label: "Thueringen" },
        ],
      },
      {
        id: "kirchensteuer",
        label: "Kirchensteuerpflichtig",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      {
        id: "alter",
        label: "Alter",
        suffix: "Jahre",
        defaultValue: 25,
        min: 16,
        max: 67,
        step: 1,
      },
      {
        id: "kinder",
        label: "Kinderfreibetraege",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "Keine" },
          { value: 0.5, label: "0,5" },
          { value: 1, label: "1" },
          { value: 1.5, label: "1,5" },
          { value: 2, label: "2" },
          { value: 2.5, label: "2,5" },
          { value: 3, label: "3" },
          { value: 3.5, label: "3,5" },
          { value: 4, label: "4" },
          { value: 4.5, label: "4,5" },
          { value: 5, label: "5+" },
        ],
      },
      {
        id: "kvArt",
        label: "Krankenversicherung",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "GKV – allgemein (14,6%)" },
          { value: 1, label: "GKV – ermaessigt (14,0%)" },
        ],
      },
      {
        id: "zusatzbeitrag",
        label: "KV-Zusatzbeitrag",
        suffix: "%",
        defaultValue: 2.5,
        min: 0,
        max: 4,
        step: 0.1,
      },
    ],
    results: [
      { label: "Netto-Gehalt", key: "netto", highlight: true },
      { label: "Steuern", isSectionHeader: true, key: "_sec_steuern" },
      { label: "Lohnsteuer", key: "lohnsteuer" },
      { label: "Solidaritaetszuschlag", key: "soli" },
      { label: "Kirchensteuer", key: "kirchensteuer_betrag" },
      { label: "Steuern gesamt", key: "steuern_gesamt" },
      { label: "Sozialabgaben", isSectionHeader: true, key: "_sec_sv" },
      { label: "Rentenversicherung (9,3%)", key: "rv" },
      { label: "Arbeitslosenversicherung (1,3%)", key: "alv" },
      { label: "Krankenversicherung", key: "kv" },
      { label: "Pflegeversicherung", key: "pv" },
      { label: "Sozialabgaben gesamt", key: "sv_gesamt" },
      { label: "Abzuege gesamt", key: "abzuege_gesamt" },
    ],
  },
  {
    slug: "sparplan-rechner",
    title: "Sparplan-Rechner",
    excerpt:
      "Wie viel Vermoegen baust du mit deinem Sparplan auf? Mit Anfangskapital, Zinseszins und optionaler Steuerberechnung.",
    category: "Sparen & Budget",
    categoryEmoji: "🎯",
    computeAll: computeSparplan,
    fields: [
      {
        id: "anfangskapital",
        label: "Anfangskapital",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 500000,
        step: 500,
      },
      {
        id: "sparrate",
        label: "Sparrate",
        suffix: "€",
        defaultValue: 100,
        min: 0,
        max: 10000,
        step: 25,
      },
      {
        id: "sparintervall",
        label: "Sparintervall",
        type: "select",
        defaultValue: 1,
        options: [
          { value: 1, label: "Monatlich" },
          { value: 3, label: "Vierteljaehrlich" },
          { value: 6, label: "Halbjaehrlich" },
          { value: 12, label: "Jaehrlich" },
        ],
      },
      {
        id: "rendite",
        label: "Rendite p.a.",
        suffix: "%",
        defaultValue: 7,
        min: 0,
        max: 20,
        step: 0.1,
      },
      {
        id: "laufzeit",
        label: "Laufzeit",
        suffix: "Jahre",
        defaultValue: 10,
        min: 1,
        max: 50,
        step: 1,
      },
      {
        id: "steuern",
        label: "Steuern beruecksichtigen",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja (KapESt 26,375%)" },
        ],
      },
      {
        id: "sparerpauschbetrag",
        label: "Sparerpauschbetrag",
        suffix: "€",
        defaultValue: 1000,
        min: 0,
        max: 2000,
        step: 100,
      },
      {
        id: "teilfreistellung",
        label: "Teilfreistellung (Aktienfonds 30%)",
        type: "select",
        defaultValue: 1,
        options: [
          { value: 1, label: "Ja (30%)" },
          { value: 0, label: "Nein" },
        ],
      },
    ],
    results: [
      { label: "Endkapital", key: "endkapital", highlight: true },
      { label: "Einzahlungen", isSectionHeader: true, key: "_sec_ein" },
      { label: "Anfangskapital", key: "anfangskapital_out" },
      { label: "Summe Sparraten", key: "sparraten_gesamt" },
      { label: "Gesamte Einzahlungen", key: "einzahlungen" },
      { label: "Rendite", isSectionHeader: true, key: "_sec_rendite" },
      { label: "Gewinn (Zinseszins)", key: "gewinn" },
      { label: "Endkapital vor Steuern", key: "endkapital_brutto" },
      { label: "Steuern", isSectionHeader: true, key: "_sec_steuern" },
      { label: "Steuerpflichtiger Gewinn", key: "steuerpflichtiger_gewinn" },
      { label: "Kapitalertragsteuer (26,375%)", key: "kapitalertragsteuer" },
    ],
  },
  {
    slug: "zinsrechner",
    title: "Zinsrechner",
    excerpt:
      "Wie viel wird aus deiner Einmalanlage? Berechne Endkapital, Zinsertraege und Effektivzins – mit Zinseszins-Effekt.",
    category: "Investieren",
    categoryEmoji: "📈",
    computeAll: computeZins,
    fields: [
      {
        id: "anfangskapital",
        label: "Anfangskapital",
        suffix: "€",
        defaultValue: 10000,
        min: 0,
        max: 1000000,
        step: 500,
      },
      {
        id: "zinssatz",
        label: "Jahreszinssatz (nominal)",
        suffix: "%",
        defaultValue: 3.5,
        min: 0,
        max: 20,
        step: 0.1,
      },
      {
        id: "laufzeitJahre",
        label: "Laufzeit (Jahre)",
        suffix: "Jahre",
        defaultValue: 5,
        min: 0,
        max: 50,
        step: 1,
      },
      {
        id: "laufzeitMonate",
        label: "Laufzeit (Monate)",
        suffix: "Monate",
        defaultValue: 0,
        min: 0,
        max: 11,
        step: 1,
      },
      {
        id: "zinsintervall",
        label: "Zinsintervall",
        type: "select",
        defaultValue: 12,
        options: [
          { value: 1, label: "Jaehrlich" },
          { value: 4, label: "Vierteljaehrlich" },
          { value: 12, label: "Monatlich" },
        ],
      },
      {
        id: "steuern",
        label: "Steuern beruecksichtigen",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja (KapESt 26,375%)" },
        ],
      },
      {
        id: "sparerpauschbetrag",
        label: "Sparerpauschbetrag",
        suffix: "€",
        defaultValue: 1000,
        min: 0,
        max: 2000,
        step: 100,
      },
    ],
    results: [
      { label: "Endkapital", key: "endkapital", highlight: true },
      { label: "Ergebnis", isSectionHeader: true, key: "_sec_ergebnis" },
      { label: "Anfangskapital", key: "anfangskapital_out" },
      { label: "Zinsertraege", key: "zinsen" },
      { label: "Endkapital vor Steuern", key: "endkapital_brutto" },
      { label: "Effektivzins p.a.", key: "effektivzins" },
      { label: "Steuern", isSectionHeader: true, key: "_sec_steuern" },
      { label: "Steuerpflichtiger Gewinn", key: "steuerpflichtiger_gewinn" },
      { label: "Kapitalertragsteuer (26,375%)", key: "kapitalertragsteuer" },
    ],
  },
  {
    slug: "budget-rechner",
    title: "Budget-Rechner (50-30-20)",
    excerpt:
      "Gib dein Einkommen und deine Ausgaben ein – der Rechner zeigt dir, ob dein Budget nach dem 50-30-20 Best-Practice-Prinzip aufgeht.",
    category: "Sparen & Budget",
    categoryEmoji: "💰",
    computeAll: computeBudget,
    fields: [
      {
        id: "netto",
        label: "Netto-Einkommen (monatlich)",
        suffix: "€",
        defaultValue: 1800,
        min: 0,
        max: 15000,
        step: 50,
      },
      // ── Fixkosten (Needs) ──
      {
        id: "miete",
        label: "Miete (warmmiete)",
        suffix: "€",
        defaultValue: 550,
        min: 0,
        max: 3000,
        step: 10,
      },
      {
        id: "nebenkosten",
        label: "Strom / Gas / Wasser",
        suffix: "€",
        defaultValue: 80,
        min: 0,
        max: 500,
        step: 5,
      },
      {
        id: "lebensmittel",
        label: "Lebensmittel & Haushalt",
        suffix: "€",
        defaultValue: 250,
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        id: "handyInternet",
        label: "Handy / Internet / Telefon",
        suffix: "€",
        defaultValue: 30,
        min: 0,
        max: 200,
        step: 5,
      },
      {
        id: "versicherungen",
        label: "Versicherungen (Haftpflicht, BU, KFZ ...)",
        suffix: "€",
        defaultValue: 50,
        min: 0,
        max: 500,
        step: 5,
      },
      {
        id: "mobilitaet",
        label: "Mobilitaet (OePNV, Auto, Tanken)",
        suffix: "€",
        defaultValue: 50,
        min: 0,
        max: 800,
        step: 10,
      },
      // ── Lifestyle (Wants) ──
      {
        id: "hobbys",
        label: "Hobbys (Sport, Musik, Gaming ...)",
        suffix: "€",
        defaultValue: 50,
        min: 0,
        max: 500,
        step: 5,
      },
      {
        id: "freizeitAusgehen",
        label: "Freizeit & Ausgehen (Restaurants, Bars ...)",
        suffix: "€",
        defaultValue: 100,
        min: 0,
        max: 800,
        step: 10,
      },
      {
        id: "shoppingKleidung",
        label: "Shopping & Kleidung",
        suffix: "€",
        defaultValue: 50,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: "urlaubReisen",
        label: "Urlaub & Reisen (monatl. umgerechnet)",
        suffix: "€",
        defaultValue: 80,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: "abosStreaming",
        label: "Abos & Streaming (Netflix, Spotify, Gym ...)",
        suffix: "€",
        defaultValue: 30,
        min: 0,
        max: 300,
        step: 5,
      },
    ],
    results: [
      { label: "Verfuegbar zum Sparen", key: "sparen", highlight: true },
      {
        label: "Fixkosten (Grundbedarf – max. 50%)",
        isSectionHeader: true,
        key: "_sec_fix",
      },
      { label: "Deine Fixkosten", key: "fixkosten_total" },
      { label: "Anteil am Einkommen", key: "fixkosten_pct" },
      { label: "Empfehlung (max. 50%)", key: "fixkosten_empf" },
      { label: "Bewertung", key: "fixkosten_bewertung" },
      {
        label: "Lifestyle (Wuensche – max. 30%)",
        isSectionHeader: true,
        key: "_sec_life",
      },
      { label: "Deine Lifestyle-Ausgaben", key: "lifestyle_total" },
      { label: "Anteil am Einkommen", key: "lifestyle_pct" },
      { label: "Empfehlung (max. 30%)", key: "lifestyle_empf" },
      { label: "Bewertung", key: "lifestyle_bewertung" },
      {
        label: "Sparen & Investieren (mind. 20%)",
        isSectionHeader: true,
        key: "_sec_spar",
      },
      { label: "Deine Sparquote", key: "sparen_pct" },
      { label: "Empfehlung (mind. 20%)", key: "sparen_empf" },
      { label: "Bewertung", key: "sparen_bewertung" },
    ],
  },
  {
    slug: "mietkosten-rechner",
    title: "Mietkosten-Rechner",
    excerpt:
      "Gib alle Wohnkosten ein und finde heraus, ob die Wohnung wirklich in dein Budget passt – personalisiert nach Stadtgroesse und Wohnform.",
    category: "Alltag & Lifestyle",
    categoryEmoji: "🏠",
    computeAll: computeMietkosten,
    fields: [
      {
        id: "netto",
        label: "Netto-Einkommen (monatlich)",
        suffix: "€",
        defaultValue: 1800,
        min: 0,
        max: 15000,
        step: 50,
      },
      {
        id: "weiteresEinkommen",
        label: "Weiteres Einkommen (BAeoeG, Kindergeld, Nebenjob)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 3000,
        step: 25,
      },
      {
        id: "wohnform",
        label: "Wohnform",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "Allein" },
          { value: 1, label: "WG" },
          { value: 2, label: "Mit Partner/in" },
        ],
      },
      {
        id: "stadttyp",
        label: "Stadtgroesse",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "Grossstadt (> 100.000 EW)" },
          { value: 1, label: "Mittelstadt (20.000–100.000 EW)" },
          { value: 2, label: "Kleinstadt / Land" },
        ],
      },
      {
        id: "kaltmiete",
        label: "Kaltmiete",
        suffix: "€",
        defaultValue: 550,
        min: 0,
        max: 3000,
        step: 10,
      },
      {
        id: "nebenkosten",
        label: "Nebenkosten (Heizung, Wasser, Muell)",
        suffix: "€",
        defaultValue: 100,
        min: 0,
        max: 500,
        step: 5,
      },
      {
        id: "strom",
        label: "Strom",
        suffix: "€",
        defaultValue: 40,
        min: 0,
        max: 200,
        step: 5,
      },
      {
        id: "internet",
        label: "Internet / WLAN",
        suffix: "€",
        defaultValue: 30,
        min: 0,
        max: 100,
        step: 5,
      },
      {
        id: "gez",
        label: "Rundfunkbeitrag (GEZ)",
        suffix: "€",
        defaultValue: 18.36,
        min: 0,
        max: 18.36,
        step: 0.01,
      },
      {
        id: "hausrat",
        label: "Hausratversicherung",
        suffix: "€",
        defaultValue: 5,
        min: 0,
        max: 50,
        step: 1,
      },
      {
        id: "qm",
        label: "Wohnungsgroesse",
        suffix: "m²",
        defaultValue: 40,
        min: 5,
        max: 200,
        step: 1,
      },
    ],
    results: [
      {
        label: "Gesamte Wohnkosten",
        key: "wohnkosten_gesamt",
        highlight: true,
      },
      { label: "Mietkosten", isSectionHeader: true, key: "_sec_miete" },
      { label: "Kaltmiete", key: "kaltmiete_out" },
      { label: "Nebenkosten", key: "nebenkosten_out" },
      { label: "Warmmiete", key: "warmmiete" },
      { label: "Strom", key: "strom_out" },
      { label: "Internet", key: "internet_out" },
      { label: "Rundfunkbeitrag", key: "gez_out" },
      { label: "Hausratversicherung", key: "hausrat_out" },
      { label: "Bewertung", isSectionHeader: true, key: "_sec_bew" },
      { label: "Wohnkostenquote", key: "wohnkosten_quote" },
      { label: "Empfehlung (max.)", key: "empf_pct" },
      { label: "Max. empfohlene Wohnkosten", key: "empf_max" },
      { label: "Ueber/unter Budget", key: "differenz" },
      { label: "Bewertung", key: "bewertung" },
      { label: "Details", isSectionHeader: true, key: "_sec_details" },
      { label: "Preis pro m² (Kaltmiete)", key: "preis_pro_qm" },
      { label: "Empfohlene Groesse", key: "empf_qm" },
      { label: "Kaution (3 Kaltmieten)", key: "kaution_3m" },
      { label: "Restbudget nach Wohnkosten", key: "rest_budget" },
    ],
  },
  {
    slug: "taschengeld-rechner",
    title: "Taschengeld-Rechner",
    excerpt:
      "Vergleiche dein Taschengeld mit der offiziellen Empfehlung, plane Fixkosten, Freizeit & Sparziel – personalisiert nach Alter und Status.",
    category: "Alltag & Lifestyle",
    categoryEmoji: "🎁",
    fields: [
      {
        id: "alter",
        label: "Dein Alter",
        suffix: "Jahre",
        defaultValue: 14,
        type: "select" as const,
        options: [
          { value: 10, label: "10 Jahre" },
          { value: 11, label: "11 Jahre" },
          { value: 12, label: "12 Jahre" },
          { value: 13, label: "13 Jahre" },
          { value: 14, label: "14 Jahre" },
          { value: 15, label: "15 Jahre" },
          { value: 16, label: "16 Jahre" },
          { value: 17, label: "17 Jahre" },
          { value: 18, label: "18+ Jahre" },
        ],
      },
      {
        id: "status",
        label: "Dein Status",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Schueler/in" },
          { value: 1, label: "Azubi" },
          { value: 2, label: "Student/in" },
          { value: 3, label: "Berufstaetig" },
        ],
      },
      {
        id: "taschengeld",
        label: "Dein monatliches Taschengeld",
        suffix: "€",
        defaultValue: 30,
        min: 0,
        max: 500,
        step: 5,
      },
      {
        id: "nebenjob",
        label: "Einkommen aus Nebenjob / Minijob",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 2000,
        step: 10,
      },
      {
        id: "handykosten",
        label: "Handyvertrag / Prepaid",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 1,
      },
      {
        id: "streaming",
        label: "Streaming & Abos (Spotify, Netflix, Gaming…)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 1,
      },
      {
        id: "mobilitaet",
        label: "Fahrtkosten (Bus, Bahn, Deutschlandticket)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 200,
        step: 1,
      },
      {
        id: "schulmaterial",
        label: "Schul- / Uni-Material pro Monat",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 1,
      },
      {
        id: "sparziel",
        label: "Dein Sparziel (z.B. Konsole, Fuehrerschein, Reise)",
        suffix: "€",
        defaultValue: 500,
        min: 0,
        max: 10000,
        step: 50,
      },
      {
        id: "sparzeit",
        label: "In wie vielen Monaten erreichen?",
        suffix: "Monate",
        defaultValue: 12,
        min: 1,
        max: 60,
        step: 1,
      },
    ],
    computeAll: computeTaschengeld,
    results: [
      // ── Empfehlung ──
      {
        label: "Empfehlung (DJI-Taschengeldtabelle)",
        isSectionHeader: true,
        key: "_sec1",
      },
      { label: "DJI-Empfehlung: Minimum", key: "empf_min" },
      { label: "DJI-Empfehlung: Maximum", key: "empf_max" },
      { label: "Differenz zu Empfehlung (Mitte)", key: "diff_empf" },
      { label: "Bewertung", key: "bewertung_tg" },
      // ── Dein Gesamtbudget ──
      { label: "Dein Gesamtbudget", isSectionHeader: true, key: "_sec2" },
      { label: "Taschengeld + Nebenjob", key: "gesamtbudget", highlight: true },
      { label: "Davon Fixkosten gesamt", key: "fixkosten" },
      { label: "Fixkosten-Anteil", key: "fixkosten_pct" },
      {
        label: "Restbudget nach Fixkosten",
        key: "rest_nach_fix",
        highlight: true,
      },
      { label: "Fixkosten-Check", key: "bewertung_fix" },
      // ── Empfohlene Aufteilung (50-30-20) ──
      {
        label: "Empfohlene Aufteilung (50-30-20)",
        isSectionHeader: true,
        key: "_sec3",
      },
      { label: "Bedarf (Handy, Fahrt, Schule) – 50%", key: "budget_bedarf" },
      {
        label: "Freizeit (Kino, Hobbys, Snacks) – 30%",
        key: "budget_freizeit",
      },
      { label: "Sparen (ETF, Sparziel) – 20%", key: "budget_sparen" },
      // ── Reale Aufteilung nach Fixkosten ──
      {
        label: "Reale Aufteilung (nach Fixkosten)",
        isSectionHeader: true,
        key: "_sec4",
      },
      { label: "Fuer Freizeit verfuegbar (60%)", key: "freizeit_real" },
      {
        label: "Zum Sparen moeglich (40%)",
        key: "sparen_real",
        highlight: true,
      },
      // ── Sparziel-Analyse ──
      { label: "Dein Sparziel", isSectionHeader: true, key: "_sec5" },
      { label: "Noetige Sparrate pro Monat", key: "sparrate_noetig" },
      { label: "Realistisch moegliche Sparrate", key: "sparen_real" },
      { label: "Monate bis zum Ziel (realistisch)", key: "monate_real" },
      { label: "Sparziel-Check", key: "bewertung_sparziel" },
      // ── Tipps & Ideen ──
      { label: "Nebenjob & Spar-Ideen", isSectionHeader: true, key: "_sec6" },
      { label: "Nebenjob-Tipp fuer dich", key: "nebenjob_tipp" },
      { label: "Max. Nebenjob-Potenzial", key: "nebenjob_potenzial" },
      { label: "Spar-Ideen fuer dein Alter", key: "spar_ideen" },
    ],
  },
  {
    slug: "notgroschen-rechner",
    title: "Notgroschen-Rechner",
    excerpt:
      "Wie viel Notgroschen brauchst du wirklich? Personalisiert nach Status, Fixkosten, Auto & Haustier – mit konkretem Aufbauplan.",
    category: "Sparen & Budget",
    categoryEmoji: "🛡️",
    fields: [
      {
        id: "netto",
        label: "Monatliches Nettoeinkommen",
        suffix: "€",
        defaultValue: 2000,
        min: 0,
        max: 10000,
        step: 100,
      },
      {
        id: "status",
        label: "Beruflicher Status",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Angestellt" },
          { value: 1, label: "Selbststaendig / Freiberuflich" },
          { value: 2, label: "Student/in" },
          { value: 3, label: "Azubi" },
        ],
      },
      {
        id: "miete",
        label: "Miete (kalt)",
        suffix: "€",
        defaultValue: 600,
        min: 0,
        max: 3000,
        step: 50,
      },
      {
        id: "nebenkosten",
        label: "Nebenkosten (Strom, Heizung, Wasser, Internet)",
        suffix: "€",
        defaultValue: 150,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: "versicherungen",
        label: "Versicherungen (Haftpflicht, Hausrat, KV-Zusatz…)",
        suffix: "€",
        defaultValue: 50,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: "mobilitaet",
        label: "Mobilitaet (Deutschlandticket, Tankkosten…)",
        suffix: "€",
        defaultValue: 50,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: "lebensmittel",
        label: "Lebensmittel & Drogerie",
        suffix: "€",
        defaultValue: 250,
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        id: "sonstiges",
        label: "Sonstige Fixkosten (Handy, Abos, Raten…)",
        suffix: "€",
        defaultValue: 100,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: "auto",
        label: "Hast du ein Auto?",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      {
        id: "haustier",
        label: "Hast du ein Haustier?",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      {
        id: "vorhanden",
        label: "Bereits angespartes Notpolster",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 50000,
        step: 100,
      },
      {
        id: "sparrate",
        label: "Monatliche Sparrate fuer Notgroschen",
        suffix: "€",
        defaultValue: 200,
        min: 0,
        max: 2000,
        step: 25,
      },
    ],
    computeAll: computeNotgroschen,
    results: [
      // ── Deine Fixkosten ──
      {
        label: "Deine monatlichen Fixkosten",
        isSectionHeader: true,
        key: "_sec1",
      },
      { label: "Fixkosten gesamt", key: "fixkosten" },
      { label: "Fixkosten-Quote (vom Netto)", key: "fixkosten_quote" },
      // ── Empfehlung ──
      { label: "Notgroschen-Empfehlung", isSectionHeader: true, key: "_sec2" },
      { label: "Dein Status", key: "status_text" },
      { label: "Empfohlene Monate (Min.)", key: "empf_monate_min" },
      { label: "Empfohlene Monate (Max.)", key: "empf_monate_max" },
      { label: "Zuschlag Auto (Reparatur-Puffer)", key: "zuschlag_auto" },
      {
        label: "Zuschlag Haustier (Tierarzt-Puffer)",
        key: "zuschlag_haustier",
      },
      { label: "Notgroschen Minimum", key: "notgroschen_min" },
      { label: "Notgroschen Maximum", key: "notgroschen_max" },
      {
        label: "Notgroschen Empfehlung (Mitte)",
        key: "notgroschen_empf",
        highlight: true,
      },
      // ── Dein Status ──
      { label: "Dein aktueller Stand", isSectionHeader: true, key: "_sec3" },
      { label: "Bereits vorhanden", key: "vorhanden" },
      { label: "Fortschritt", key: "fortschritt_pct" },
      { label: "Differenz zum Ziel", key: "differenz" },
      { label: "Bewertung", key: "bewertung" },
      // ── Aufbauplan ──
      { label: "Aufbauplan", isSectionHeader: true, key: "_sec4" },
      { label: "Fehlbetrag", key: "fehlbetrag" },
      {
        label: "Monate bis Ziel (bei deiner Sparrate)",
        key: "monate_aufbau",
        highlight: true,
      },
      { label: "Noetige Sparrate fuer 6 Monate", key: "sparrate6m" },
      { label: "Noetige Sparrate fuer 12 Monate", key: "sparrate12m" },
      { label: "Noetige Sparrate fuer 24 Monate", key: "sparrate24m" },
      { label: "Deine Sparquote", key: "sparquote" },
      // ── Tagesgeld-Tipp ──
      { label: "Wo anlegen?", isSectionHeader: true, key: "_sec5" },
      { label: "Tagesgeld-Zinsen pro Jahr (ca. 3%)", key: "tagesgeld_ertrag" },
      { label: "Empfehlung", key: "tagesgeld_tipp" },
    ],
  },
  {
    slug: "nebenjob-steuer-rechner",
    title: "Nebenjob- & Minijob-Rechner",
    excerpt:
      "Minijob, Midijob oder Werkstudent? Berechne Brutto, Netto, Abgaben und Arbeitgeberkosten – mit aktuellen Saetzen 2025.",
    category: "Gehalt & Arbeit",
    categoryEmoji: "💪",
    fields: [
      {
        id: "stundenlohn",
        label: "Dein Stundenlohn (brutto)",
        suffix: "€",
        defaultValue: 12.82,
        min: 0,
        max: 50,
        step: 0.5,
      },
      {
        id: "stunden",
        label: "Stunden pro Woche",
        suffix: "Std",
        defaultValue: 10,
        min: 0,
        max: 40,
        step: 1,
      },
      {
        id: "jobtyp",
        label: "Art der Beschaeftigung",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Gewerblicher Minijob / Nebenjob" },
          { value: 1, label: "Minijob im Privathaushalt" },
          { value: 2, label: "Werkstudent/in" },
        ],
      },
      {
        id: "rv_befreiung",
        label: "Von Rentenversicherung befreit?",
        suffix: "",
        defaultValue: 1,
        type: "select" as const,
        options: [
          { value: 1, label: "Ja – befreit (Standard bei Minijob)" },
          { value: 0, label: "Nein – RV-pflichtig (eigener Beitrag)" },
        ],
      },
      {
        id: "hat_hauptjob",
        label: "Hast du einen Hauptjob?",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Nein – dies ist mein einziger Job" },
          { value: 1, label: "Ja – Nebenjob neben Hauptjob" },
        ],
      },
      {
        id: "kinderlos",
        label: "Kinderlos und ueber 23?",
        suffix: "",
        defaultValue: 1,
        type: "select" as const,
        options: [
          { value: 1, label: "Ja (PV-Zuschlag 0,6%)" },
          { value: 0, label: "Nein / unter 23" },
        ],
      },
    ],
    computeAll: computeNebenjob,
    results: [
      // ── Dein Verdienst ──
      { label: "Dein Verdienst", isSectionHeader: true, key: "_sec1" },
      { label: "Brutto pro Monat", key: "brutto_monat" },
      { label: "Brutto pro Jahr", key: "brutto_jahr" },
      { label: "Stunden pro Monat", key: "stunden_monat" },
      { label: "Einstufung", key: "kategorie", highlight: true },
      { label: "Details", key: "kategorie_detail" },
      // ── Deine Abzuege (Arbeitnehmer) ──
      {
        label: "Deine Abzuege (Arbeitnehmer)",
        isSectionHeader: true,
        key: "_sec2",
      },
      { label: "Rentenversicherung (AN)", key: "an_rv" },
      { label: "Krankenversicherung (AN)", key: "an_kv" },
      { label: "Pflegeversicherung (AN)", key: "an_pv" },
      { label: "Arbeitslosenversicherung (AN)", key: "an_alv" },
      { label: "Lohnsteuer (geschaetzt)", key: "an_steuer" },
      { label: "Abzuege gesamt", key: "an_gesamt" },
      { label: "Abgabenquote", key: "abgaben_quote" },
      // ── Dein Netto ──
      { label: "Dein Netto", isSectionHeader: true, key: "_sec3" },
      { label: "Netto pro Monat", key: "netto_monat", highlight: true },
      { label: "Netto pro Jahr", key: "netto_jahr" },
      { label: "Effektiver Netto-Stundenlohn", key: "netto_stunde" },
      // ── Kosten fuer den Arbeitgeber ──
      {
        label: "Kosten fuer den Arbeitgeber",
        isSectionHeader: true,
        key: "_sec4",
      },
      { label: "AG: Krankenversicherung", key: "ag_kv" },
      { label: "AG: Rentenversicherung", key: "ag_rv" },
      { label: "AG: Pauschsteuer", key: "ag_steuer" },
      { label: "AG: Umlage U1 (Krankheit)", key: "ag_u1" },
      { label: "AG: Umlage U2 (Mutterschaft)", key: "ag_u2" },
      { label: "AG: Insolvenzgeldumlage", key: "ag_insolvenz" },
      { label: "AG Abgaben gesamt", key: "ag_gesamt" },
      {
        label: "AG Gesamtkosten (Brutto + Abgaben)",
        key: "ag_total_kosten",
        highlight: true,
      },
      // ── Bewertung & Tipps ──
      { label: "Bewertung & Hinweise", isSectionHeader: true, key: "_sec5" },
      {
        label: "Max. Stunden fuer Minijob (bei deinem Lohn)",
        key: "max_stunden_minijob",
      },
      { label: "Bewertung", key: "bewertung" },
      { label: "Steuer-Hinweis", key: "steuer_hinweis" },
    ],
  },
  {
    slug: "bafog-rechner",
    title: "BAföG-Rechner",
    excerpt:
      "Wie viel BAföG steht dir zu? Berechne deinen Anspruch personalisiert nach Wohnung, Elterneinkommen, Nebenjob und Vermoegen.",
    category: "Studium & Ausbildung",
    categoryEmoji: "🎓",
    fields: [
      {
        id: "wohnsituation",
        label: "Wohnsituation",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Eigene Wohnung / WG" },
          { value: 1, label: "Bei den Eltern" },
        ],
      },
      {
        id: "eigen_kv",
        label: "Krankenversicherung",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Familienversichert (unter 25)" },
          { value: 1, label: "Eigene KV (ab 25 oder freiwillig)" },
        ],
      },
      {
        id: "eltern_brutto",
        label: "Jahresbrutto beider Eltern (gesamt)",
        suffix: "€",
        defaultValue: 40000,
        min: 0,
        max: 200000,
        step: 1000,
      },
      {
        id: "eltern_status",
        label: "Familienstand der Eltern",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Verheiratet / zusammenlebend" },
          { value: 1, label: "Getrennt / alleinerziehend" },
        ],
      },
      {
        id: "geschwister_frei",
        label: "Geschwister OHNE foerderfaehige Ausbildung",
        suffix: "Personen",
        defaultValue: 0,
        min: 0,
        max: 5,
        step: 1,
      },
      {
        id: "geschwister_ausb",
        label: "Geschwister IN foerderfaehiger Ausbildung",
        suffix: "Personen",
        defaultValue: 0,
        min: 0,
        max: 5,
        step: 1,
      },
      {
        id: "eigen_einkommen",
        label: "Dein monatliches Einkommen (Minijob etc.)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 2000,
        step: 50,
      },
      {
        id: "vermoegen",
        label: "Dein Vermoegen (Konto, Depot, Sparbuch)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 100000,
        step: 500,
      },
      {
        id: "partner_einkommen",
        label: "Einkommen Ehepartner (monatlich brutto)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 10000,
        step: 100,
      },
    ],
    computeAll: computeBafoeg,
    results: [
      // ── Dein Bedarf ──
      { label: "Dein monatlicher Bedarf", isSectionHeader: true, key: "_sec1" },
      { label: "Grundbedarf", key: "grundbedarf" },
      { label: "Wohnpauschale", key: "wohnpauschale" },
      { label: "KV-Zuschlag", key: "kv_zuschlag" },
      { label: "PV-Zuschlag", key: "pv_zuschlag" },
      {
        label: "Gesamtbedarf (max. BAfoeg)",
        key: "gesamt_bedarf",
        highlight: true,
      },
      // ── Elterneinkommen ──
      {
        label: "Anrechnung Elterneinkommen",
        isSectionHeader: true,
        key: "_sec2",
      },
      {
        label: "Eltern: bereinigtes Netto (monatlich)",
        key: "eltern_netto_monat",
      },
      { label: "Eltern: Freibetrag", key: "eltern_freibetrag" },
      { label: "Eltern: Ueberhang", key: "eltern_ueberhang" },
      { label: "Anrechnungssatz", key: "anrechnungs_satz" },
      { label: "Anrechnung Eltern (auf dich)", key: "eltern_anrechnung" },
      // ── Weitere Anrechnungen ──
      { label: "Weitere Anrechnungen", isSectionHeader: true, key: "_sec3" },
      { label: "Anrechnung eigenes Einkommen", key: "eigen_anrechnung" },
      {
        label: "Anrechnung Vermoegen (monatlich)",
        key: "vermoegen_anrechnung",
      },
      { label: "Anrechnung Ehepartner", key: "partner_anrechnung" },
      { label: "Gesamtanrechnung", key: "gesamt_anrechnung" },
      // ── Dein BAfoeg ──
      { label: "Dein BAfoeg-Ergebnis", isSectionHeader: true, key: "_sec4" },
      { label: "BAfoeg pro Monat", key: "bafoeg_monat", highlight: true },
      { label: "BAfoeg pro Jahr", key: "bafoeg_jahr" },
      { label: "Davon Zuschuss (geschenkt, 50%)", key: "zuschuss" },
      { label: "Davon Darlehen (zurueckzahlen, 50%)", key: "darlehen" },
      { label: "Max. Rueckzahlung (gedeckelt)", key: "max_rueckzahlung" },
      // ── Bewertung ──
      { label: "Bewertung & Checks", isSectionHeader: true, key: "_sec5" },
      { label: "Bewertung", key: "bewertung" },
      { label: "Minijob-Kompatibilitaet", key: "minijob_check" },
      { label: "Vermoegens-Check", key: "vermoegen_check" },
    ],
  },
  {
    slug: "stundenlohn-rechner",
    title: "Stundenlohnrechner",
    excerpt:
      "Was verdienst du wirklich pro Stunde? Berechne formalen, effektiven und Sonderzahlungs-Stundenlohn – mit Feiertagen je Bundesland.",
    category: "Gehalt & Arbeit",
    categoryEmoji: "⏱️",
    fields: [
      {
        id: "monatsgehalt",
        label: "Monatsgehalt (Brutto)",
        suffix: "€",
        defaultValue: 3000,
        min: 0,
        max: 20000,
        step: 100,
      },
      {
        id: "wochenstunden",
        label: "Arbeitsstunden pro Woche",
        suffix: "Std",
        defaultValue: 40,
        min: 1,
        max: 60,
        step: 1,
      },
      {
        id: "arbeitstage",
        label: "Arbeitstage pro Woche",
        suffix: "Tage",
        defaultValue: 5,
        type: "select" as const,
        options: [
          { value: 5, label: "5 Tage (Mo-Fr)" },
          { value: 6, label: "6 Tage (Mo-Sa)" },
        ],
      },
      {
        id: "urlaubstage",
        label: "Urlaubstage pro Jahr",
        suffix: "Tage",
        defaultValue: 28,
        min: 20,
        max: 40,
        step: 1,
      },
      {
        id: "bundesland",
        label: "Bundesland (fuer Feiertage)",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Bundesweit (9 Feiertage)" },
          { value: 1, label: "Bayern (13)" },
          { value: 2, label: "Baden-Wuerttemberg (12)" },
          { value: 3, label: "NRW (11)" },
          { value: 4, label: "Niedersachsen (11)" },
          { value: 5, label: "Berlin (10)" },
          { value: 6, label: "Hessen (11)" },
          { value: 7, label: "Saarland (12)" },
          { value: 8, label: "Sachsen (11)" },
          { value: 9, label: "Thueringen (11)" },
          { value: 10, label: "Hamburg (10)" },
          { value: 11, label: "Bremen (10)" },
          { value: 12, label: "Schleswig-Holstein (10)" },
          { value: 13, label: "Rheinland-Pfalz (11)" },
          { value: 14, label: "Sachsen-Anhalt (11)" },
          { value: 15, label: "Mecklenburg-Vorpommern (11)" },
          { value: 16, label: "Brandenburg (12)" },
        ],
      },
      {
        id: "weihnachtsgeld",
        label: "Weihnachtsgeld (in % vom Monatsgehalt)",
        suffix: "%",
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 25,
      },
      {
        id: "urlaubsgeld",
        label: "Urlaubsgeld (jaehrlich)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 5000,
        step: 100,
      },
      {
        id: "bonus",
        label: "Bonus / Praemie (jaehrlich)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 20000,
        step: 500,
      },
    ],
    computeAll: computeStundenlohn,
    results: [
      // ── Dein Stundenlohn ──
      { label: "Dein Stundenlohn", isSectionHeader: true, key: "_sec1" },
      {
        label: "Formaler Stundenlohn (Brutto)",
        key: "stundenlohn_formal",
        highlight: true,
      },
      {
        label: "Effektiver Stundenlohn (mit Urlaub & Feiertagen)",
        key: "stundenlohn_effektiv",
      },
      {
        label: "Effektiver Stundenlohn (inkl. Sonderzahlungen)",
        key: "stundenlohn_mit_sonder",
        highlight: true,
      },
      { label: "Sonderzahlungen pro Arbeitsstunde", key: "sonder_pro_stunde" },
      { label: "Mindestlohn-Check", key: "mindestlohn_check" },
      // ── Verdienst-Uebersicht ──
      { label: "Verdienst-Uebersicht", isSectionHeader: true, key: "_sec2" },
      { label: "Tagesverdienst", key: "tagesverdienst" },
      { label: "Wochenverdienst", key: "wochenverdienst" },
      { label: "Monatsgehalt", key: "monatsgehalt_out" },
      {
        label: "Jahresgehalt (ohne Sonderzahlungen)",
        key: "jahresgehalt_ohne",
      },
      {
        label: "Jahresgehalt (inkl. Sonderzahlungen)",
        key: "jahresgehalt_mit",
        highlight: true,
      },
      { label: "Davon Sonderzahlungen", key: "sonderzahlungen" },
      { label: "Davon Weihnachtsgeld", key: "weihnachtsgeld_betrag" },
      // ── Arbeitszeit-Analyse ──
      { label: "Arbeitszeit-Analyse", isSectionHeader: true, key: "_sec3" },
      { label: "Arbeitstage/Jahr (brutto)", key: "arbeitstage_brutto" },
      { label: "Urlaubstage", key: "urlaubstage_out" },
      { label: "Feiertage (Bundesland)", key: "feiertage" },
      { label: "Feiertage auf Arbeitstage", key: "feiertage_arbeitstage" },
      { label: "Tatsaechliche Arbeitstage/Jahr", key: "arbeitstage_netto" },
      { label: "Stunden pro Arbeitstag", key: "stunden_pro_tag" },
      {
        label: "Tatsaechliche Arbeitsstunden/Jahr",
        key: "arbeitsstunden_jahr",
      },
      {
        label: "Bezahlte Freistunden (Urlaub+Feiertage)",
        key: "freizeit_stunden",
      },
      // ── Bewertung ──
      { label: "Bewertung", isSectionHeader: true, key: "_sec4" },
      { label: "Fazit", key: "bewertung" },
    ],
  },
  {
    slug: "spritrechner",
    title: "Spritrechner",
    excerpt:
      "Was kostet deine Fahrt wirklich? Spritkosten, Pendlerpauschale, Mitfahrer-Aufteilung, CO2-Bilanz und Deutschlandticket-Vergleich.",
    category: "Alltag & Lifestyle",
    categoryEmoji: "⛽",
    fields: [
      {
        id: "strecke",
        label: "Strecke (einfache Fahrt)",
        suffix: "km",
        defaultValue: 25,
        min: 1,
        max: 500,
        step: 1,
      },
      {
        id: "kraftstoff",
        label: "Kraftstoffart",
        suffix: "",
        defaultValue: 0,
        type: "select" as const,
        options: [
          { value: 0, label: "Benzin (Super E5/E10)" },
          { value: 1, label: "Diesel" },
          { value: 2, label: "E-Auto (Strom)" },
          { value: 3, label: "Hybrid" },
        ],
      },
      {
        id: "verbrauch",
        label: "Verbrauch (l/100km bzw. kWh/100km)",
        suffix: "pro 100km",
        defaultValue: 7,
        min: 1,
        max: 30,
        step: 0.5,
      },
      {
        id: "spritpreis",
        label: "Preis pro Liter / kWh",
        suffix: "€",
        defaultValue: 1.75,
        min: 0.1,
        max: 3,
        step: 0.05,
      },
      {
        id: "fahrten",
        label: "Fahrten pro Woche (hin + zurueck)",
        suffix: "Fahrten",
        defaultValue: 10,
        min: 1,
        max: 14,
        step: 1,
      },
      {
        id: "mitfahrer",
        label: "Mitfahrer (Kosten teilen)",
        suffix: "Personen",
        defaultValue: 0,
        min: 0,
        max: 4,
        step: 1,
      },
      {
        id: "ist_pendler",
        label: "Pendler (Arbeitsweg)?",
        suffix: "",
        defaultValue: 1,
        type: "select" as const,
        options: [
          { value: 1, label: "Ja – Pendlerpauschale berechnen" },
          { value: 0, label: "Nein" },
        ],
      },
      {
        id: "steuersatz",
        label: "Dein Grenzsteuersatz (fuer Pendlerpauschale)",
        suffix: "%",
        defaultValue: 30,
        min: 0,
        max: 45,
        step: 1,
      },
    ],
    computeAll: computeSprit,
    results: [
      // ── Kosten pro Fahrt ──
      { label: "Deine Fahrtkosten", isSectionHeader: true, key: "_sec1" },
      { label: "Kraftstoffart", key: "kraftstoff_label" },
      { label: "Verbrauch pro Fahrt", key: "verbrauch_pro_fahrt" },
      { label: "Kosten pro Fahrt", key: "kosten_pro_fahrt", highlight: true },
      { label: "Kosten pro Kilometer", key: "kosten_pro_km" },
      // ── Zeitraeume ──
      { label: "Kosten-Uebersicht", isSectionHeader: true, key: "_sec2" },
      { label: "Pro Woche", key: "kosten_woche" },
      { label: "Pro Monat", key: "kosten_monat", highlight: true },
      { label: "Pro Jahr", key: "kosten_jahr" },
      { label: "Pro Jahr (nach Pendlerpauschale)", key: "real_kosten_jahr" },
      // ── Fahrgemeinschaft ──
      { label: "Fahrgemeinschaft", isSectionHeader: true, key: "_sec3" },
      { label: "Personen im Auto", key: "personen_gesamt" },
      { label: "Kosten pro Person / Monat", key: "kosten_pro_person" },
      { label: "Deine Ersparnis durch Mitfahrer", key: "ersparnis_mitfahrer" },
      // ── Pendlerpauschale ──
      { label: "Pendlerpauschale (2025)", isSectionHeader: true, key: "_sec4" },
      { label: "Absetzbar pro Jahr", key: "pendler_jahr" },
      { label: "Steuerersparnis", key: "pendler_ersparnis", highlight: true },
      { label: "Details", key: "pendler_text" },
      // ── OEPNV-Vergleich ──
      {
        label: "Vergleich: Deutschlandticket",
        isSectionHeader: true,
        key: "_sec5",
      },
      { label: "Deutschlandticket pro Jahr", key: "dticket_jahr" },
      { label: "Differenz (Auto vs. Ticket)", key: "diff_dticket" },
      { label: "Empfehlung", key: "dticket_vergleich" },
      // ── CO2 & Bewertung ──
      { label: "CO2-Bilanz & Bewertung", isSectionHeader: true, key: "_sec6" },
      { label: "CO2 pro Fahrt", key: "co2_pro_fahrt" },
      { label: "CO2 pro Jahr", key: "co2_pro_jahr" },
      { label: "Bewertung", key: "bewertung" },
    ],
  },
  {
    slug: "inflationsrechner",
    title: "Inflationsrechner",
    excerpt:
      "Wie viel ist dein Geld in 10 Jahren noch wert? Kaufkraft, Realzins & Warenkorb auf einen Blick.",
    category: "Sparen & Budget",
    categoryEmoji: "📉",
    computeAll: computeInflation,
    fields: [
      {
        id: "betrag",
        label: "Geldbetrag",
        suffix: "€",
        defaultValue: 10000,
        min: 100,
        max: 1000000,
        step: 500,
      },
      {
        id: "inflationsrate",
        label: "Jaehrliche Inflationsrate",
        suffix: "%",
        defaultValue: 2.5,
        min: 0,
        max: 15,
        step: 0.1,
      },
      {
        id: "jahre",
        label: "Zeitraum",
        suffix: "Jahre",
        defaultValue: 10,
        min: 1,
        max: 50,
        step: 1,
      },
      {
        id: "zinssatz",
        label: "Zinssatz (Sparbuch / Tagesgeld / ETF)",
        suffix: "%",
        defaultValue: 0,
        min: 0,
        max: 15,
        step: 0.1,
      },
      {
        id: "sparrate",
        label: "Monatliche Sparrate (optional)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 5000,
        step: 25,
      },
      {
        id: "gehalt",
        label: "Brutto-Monatsgehalt (optional)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 20000,
        step: 100,
      },
      {
        id: "gehaltserhoehung",
        label: "Jaehrliche Gehaltserhoehung",
        suffix: "%",
        defaultValue: 2.0,
        min: 0,
        max: 10,
        step: 0.5,
      },
    ],
    results: [
      // Kaufkraft-Analyse
      { label: "Kaufkraft-Analyse", isSectionHeader: true },
      {
        label: "Kaufkraft in heutigen Euro",
        key: "kaufkraft_zukunft",
        highlight: true,
      },
      { label: "Kaufkraftverlust", key: "kaufkraft_verlust_euro" },
      {
        label: "Kaufkraftverlust in Prozent",
        key: "kaufkraft_verlust_prozent",
      },
      {
        label: "Benoetigter Betrag fuer gleiche Kaufkraft",
        key: "noetiger_betrag",
      },
      { label: "Kaufkraft-Halbierung nach ca.", key: "halbierung_kaufkraft" },
      { label: "Kaufkraft-Zeitachse", key: "zeitachse" },

      // Zinsen vs. Inflation
      { label: "Zinsen vs. Inflation", isSectionHeader: true },
      { label: "Realzins (nach Inflation)", key: "realzins" },
      { label: "Nominalwert mit Zinsen", key: "nominal_mit_zinsen" },
      { label: "Realwert (kaufkraftbereinigt)", key: "realwert_mit_zinsen" },
      { label: "Realer Gewinn / Verlust", key: "realer_gewinn_verlust" },

      // Sparplan-Analyse
      { label: "Sparplan-Analyse", isSectionHeader: true },
      { label: "Eingezahlt", key: "sparplan_eingezahlt" },
      { label: "Endwert (nominal)", key: "sparplan_nominal" },
      { label: "Endwert (real, kaufkraftbereinigt)", key: "sparplan_real" },
      { label: "Kaufkraftverlust auf Sparplan", key: "sparplan_verlust" },

      // Gehalts-Analyse
      { label: "Gehalts-Analyse", isSectionHeader: true },
      { label: "Gehalt in X Jahren (nominal)", key: "gehalt_zukunft_nominal" },
      {
        label: "Gehalt in X Jahren (reale Kaufkraft)",
        key: "gehalt_zukunft_real",
      },
      {
        label: "Kaufkraftverlust pro Monat",
        key: "gehalt_kaufkraft_verlust_monat",
      },
      {
        label: "Kaufkraftverlust pro Jahr",
        key: "gehalt_kaufkraft_verlust_jahr",
      },
      { label: "Gehalts-Bewertung", key: "gehalt_text" },

      // Warenkorb & Historie
      { label: "Warenkorb-Projektion", isSectionHeader: true },
      { label: "Preisentwicklung (Top 5)", key: "warenkorb_text" },

      { label: "Historische Inflation Deutschland", isSectionHeader: true },
      { label: "Inflationsraten nach Jahr", key: "hist_text" },
      { label: "Durchschnitt letzte 10 Jahre", key: "schnitt_10j" },
      { label: "Durchschnitt letzte 5 Jahre (inkl. Krise)", key: "schnitt_5j" },
      { label: "EZB-Inflationsziel", key: "ezb_ziel" },

      // Bewertung
      { label: "Deine persoenliche Bewertung", isSectionHeader: true },
      { label: "Analyse", key: "bewertung" },
      { label: "Tipp fuer junge Menschen", key: "tipp_jung" },
    ],
  },
  {
    slug: "rentenluecken-rechner",
    title: "Rentenluecken-Rechner",
    excerpt: "Wie viel Geld fehlt dir im Alter – und was musst du jetzt tun?",
    category: "Rente & Vorsorge",
    categoryEmoji: "🏖️",
    computeAll: computeRentenluecke,
    fields: [
      {
        id: "alter",
        label: "Dein Alter",
        suffix: "Jahre",
        defaultValue: 25,
        min: 16,
        max: 65,
        step: 1,
      },
      {
        id: "renteneintritt",
        label: "Renteneintrittsalter",
        suffix: "Jahre",
        defaultValue: 67,
        min: 55,
        max: 70,
        step: 1,
      },
      {
        id: "netto",
        label: "Aktuelles Netto-Einkommen",
        suffix: "€",
        defaultValue: 2500,
        min: 500,
        max: 10000,
        step: 100,
      },
      {
        id: "wunschrente",
        label: "Gewuenschter Anteil im Alter",
        suffix: "%",
        defaultValue: 80,
        min: 50,
        max: 100,
        step: 5,
      },
      {
        id: "gesetzliche_rente",
        label: "Erwartete gesetzliche Rente (netto)",
        suffix: "€",
        defaultValue: 1200,
        min: 0,
        max: 4000,
        step: 50,
      },
      {
        id: "private_vorsorge",
        label: "Private Vorsorge (z.B. Riester, bAV)",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 3000,
        step: 50,
      },
      {
        id: "vorhandenes_vermoegen",
        label: "Bereits vorhandenes Vermoegen",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 500000,
        step: 1000,
      },
      {
        id: "inflation",
        label: "Erwartete Inflation",
        suffix: "%",
        defaultValue: 2.0,
        min: 0,
        max: 6,
        step: 0.5,
      },
      {
        id: "rendite",
        label: "Erwartete Rendite (p.a.)",
        suffix: "%",
        defaultValue: 6.0,
        min: 0,
        max: 12,
        step: 0.5,
      },
      {
        id: "rentendauer",
        label: "Geplante Rentendauer",
        suffix: "Jahre",
        defaultValue: 20,
        min: 10,
        max: 40,
        step: 1,
      },
    ],
    results: [
      {
        label: "Deine Rentenluecke",
        isSectionHeader: true,
        key: "_sec_luecke",
      },
      {
        label: "Gewuenschtes Einkommen im Alter",
        key: "wunschrente_heute",
      },
      {
        label: "Gesetzliche Rente (netto)",
        key: "gesetzliche_rente_out",
      },
      {
        label: "Private Vorsorge",
        key: "private_vorsorge_out",
      },
      {
        label: "Monatliche Rentenluecke (heute)",
        key: "luecke_heute_monat",
        highlight: true,
      },
      {
        label: "Jaehrliche Rentenluecke (heute)",
        key: "luecke_heute_jahr",
      },
      {
        label: "Mit Inflation",
        isSectionHeader: true,
        key: "_sec_inflation",
      },
      {
        label: "Rentenluecke bei Renteneintritt (monatlich)",
        key: "luecke_real_monat",
        highlight: true,
      },
      {
        label: "Rentenluecke bei Renteneintritt (jaehrlich)",
        key: "luecke_real_jahr",
      },
      {
        label: "Gesamte Luecke ueber Rentendauer",
        key: "gesamte_luecke",
      },
      {
        label: "Kaufkraftverlust durch Inflation",
        key: "inflationsfaktor",
      },
      {
        label: "Dein Sparplan",
        isSectionHeader: true,
        key: "_sec_sparplan",
      },
      {
        label: "Benoetigtes Vermoegen bei Renteneintritt",
        key: "benoetigtes_vermoegen",
        highlight: true,
      },
      {
        label: "Vorhandenes Vermoegen hochgerechnet",
        key: "vorhandenes_vermoegen_rente",
      },
      {
        label: "Noch aufzubauendes Vermoegen",
        key: "noch_aufzubauen",
      },
      {
        label: "Noetige Sparrate (monatlich)",
        key: "sparrate_monat",
        highlight: true,
      },
      {
        label: "Noetige Sparrate (jaehrlich)",
        key: "sparrate_jahr",
      },
    ],
  },
  {
    slug: "etf-kosten-rechner",
    title: "ETF-Kostenrechner",
    excerpt: "Was kosten dich ETF-Gebuehren ueber die Jahre wirklich?",
    category: "Investieren",
    categoryEmoji: "💸",
    computeAll: computeETFKosten,
    fields: [
      {
        id: "anfangskapital",
        label: "Anfangskapital",
        suffix: "€",
        defaultValue: 0,
        min: 0,
        max: 200000,
        step: 1000,
      },
      {
        id: "sparrate",
        label: "Monatliche Sparrate",
        suffix: "€",
        defaultValue: 100,
        min: 25,
        max: 5000,
        step: 25,
      },
      {
        id: "jahre",
        label: "Anlagezeitraum",
        suffix: "Jahre",
        defaultValue: 30,
        min: 1,
        max: 50,
        step: 1,
      },
      {
        id: "rendite",
        label: "Erwartete Rendite p.a. (brutto)",
        suffix: "%",
        defaultValue: 7,
        min: 1,
        max: 15,
        step: 0.5,
      },
      {
        id: "ter_guenstig",
        label: "Guenstiger ETF (TER)",
        suffix: "%",
        defaultValue: 0.2,
        min: 0.0,
        max: 2,
        step: 0.05,
      },
      {
        id: "ter_teuer",
        label: "Teurer Fonds (TER)",
        suffix: "%",
        defaultValue: 1.5,
        min: 0.1,
        max: 3,
        step: 0.1,
      },
    ],
    results: [
      {
        label: "Guenstiger ETF",
        isSectionHeader: true,
        key: "_sec_guenstig",
      },
      {
        label: "Endvermoegen (guenstiger ETF)",
        key: "fv_guenstig",
        highlight: true,
      },
      { label: "Renditegewinn", key: "gewinn_guenstig" },
      {
        label: "Kosten durch TER (entgangene Rendite)",
        key: "kosten_guenstig",
      },
      {
        label: "Kosten pro Jahr (Durchschnitt)",
        key: "kosten_pro_jahr_guenstig",
      },
      {
        label: "Teurer Fonds",
        isSectionHeader: true,
        key: "_sec_teuer",
      },
      { label: "Endvermoegen (teurer Fonds)", key: "fv_teuer" },
      { label: "Renditegewinn", key: "gewinn_teuer" },
      {
        label: "Kosten durch TER (entgangene Rendite)",
        key: "kosten_teuer",
      },
      {
        label: "Kosten pro Jahr (Durchschnitt)",
        key: "kosten_pro_jahr_teuer",
      },
      {
        label: "Dein Vorteil",
        isSectionHeader: true,
        key: "_sec_vorteil",
      },
      {
        label: "Mehrkosten teurer Fonds",
        key: "mehrkosten",
        highlight: true,
      },
      { label: "Mehr Vermoegen mit guenstigem ETF", key: "ersparnis_prozent" },
      { label: "TER-Differenz", key: "ter_differenz" },
      {
        label: "Einzahlungen",
        isSectionHeader: true,
        key: "_sec_ein",
      },
      { label: "Gesamte Einzahlungen", key: "einzahlungen" },
      {
        label: "Theoretisches Maximum (ohne Kosten)",
        key: "fv_ohne",
      },
    ],
  },
  {
    slug: "waehrungsrechner",
    title: "Waehrungsrechner",
    excerpt: "Wie viel ist dein Geld im Ausland wert?",
    category: "Alltag & Lifestyle",
    categoryEmoji: "🌍",
    computeAll: computeWaehrung,
    fields: [
      {
        id: "betrag",
        label: "Betrag in Euro",
        suffix: "€",
        defaultValue: 100,
        min: 1,
        max: 100000,
        step: 10,
      },
      {
        id: "kurs",
        label: "Wechselkurs (1 EUR = X)",
        suffix: "",
        defaultValue: 1.08,
        min: 0.01,
        max: 20000,
        step: 0.01,
      },
      {
        id: "gebuehr",
        label: "Wechselgebuehr der Bank",
        suffix: "%",
        defaultValue: 1.5,
        min: 0,
        max: 10,
        step: 0.5,
      },
    ],
    results: [
      {
        label: "Betrag in Fremdwaehrung (ohne Gebuehr)",
        key: "betrag_fremdwaehrung_ohne_gebuehr",
      },
      {
        label: "Wechselgebuehr",
        key: "wechselgebuehr",
      },
      {
        label: "Betrag nach Gebuehr in Fremdwaehrung",
        key: "betrag_nach_gebuehr",
        highlight: true,
      },
    ],
  },
];

export const CALCULATOR_CATEGORIES = [
  { label: "Investieren", emoji: "📈" },
  { label: "Gehalt & Arbeit", emoji: "💼" },
  { label: "Sparen & Budget", emoji: "🎯" },
  { label: "Rente & Vorsorge", emoji: "🏖️" },
  { label: "Alltag & Lifestyle", emoji: "🏠" },
  { label: "Studium & Ausbildung", emoji: "🎓" },
];

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return CALCULATORS.find((calc) => calc.slug === slug);
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return CALCULATORS.filter((calc) => calc.category === category);
}
