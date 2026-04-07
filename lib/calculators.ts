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
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: "Gehalt & Arbeit" | "Sparen & Budget" | "Investieren" | "Alltag & Lifestyle" | "Studium & Ausbildung" | "Rente & Vorsorge";
  categoryEmoji: string;
  fields: CalculatorField[];
  results: CalculatorResult[];
  tips: string[];
  computeAll?: (values: Record<string, number>) => Record<string, number | string>;
  intro?: string[];
  howItWorks?: { title: string; description: string }[];
  useCases?: string[];
  faqs?: { question: string; answer: string }[];
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
  const kistJahr =
    kirchensteuerpflichtig === 1 ? lohnsteuerJahr * kistSatz : 0;

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
    const rPeriod =
      Math.pow(1 + rMonthly, sparintervallMonate) - 1;
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
    miete + nebenkosten + lebensmittel + handyInternet + versicherungen + mobilitaet;
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
  else if (fixPct <= 60) bewertungFix = "Etwas ueber Budget – pruefe Sparpotenzial";
  else bewertungFix = "Deutlich ueber 50% – Handlungsbedarf!";

  let bewertungLife: string;
  if (lifePct <= 30) bewertungLife = "Im gruenen Bereich (max. 30%)";
  else if (lifePct <= 40) bewertungLife = "Etwas ueber Budget – bewusster ausgeben";
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
  const wohnkostenGesamt =
    warmmiete + strom + internet + gez + hausrat;
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
function getTaschengeldEmpfehlung(alter: number): { min: number; max: number; woche: boolean } {
  if (alter <= 5)  return { min: 2.17, max: 2.17, woche: true };   // 0,50€/Woche
  if (alter === 6) return { min: 4.33, max: 6.50, woche: true };   // 1,00-1,50€/W
  if (alter === 7) return { min: 6.50, max: 8.66, woche: true };   // 1,50-2,00€/W
  if (alter === 8) return { min: 8.66, max: 10.83, woche: true };  // 2,00-2,50€/W
  if (alter === 9) return { min: 10.83, max: 13.00, woche: true }; // 2,50-3,00€/W
  if (alter === 10) return { min: 15.00, max: 17.50, woche: false };
  if (alter === 11) return { min: 17.50, max: 20.00, woche: false };
  if (alter === 12) return { min: 20.00, max: 22.50, woche: false };
  if (alter === 13) return { min: 22.50, max: 25.00, woche: false };
  if (alter === 14) return { min: 25.50, max: 30.50, woche: false };
  if (alter === 15) return { min: 30.50, max: 38.00, woche: false };
  if (alter === 16) return { min: 38.00, max: 45.50, woche: false };
  if (alter === 17) return { min: 45.50, max: 61.00, woche: false };
  return { min: 61.00, max: 76.00, woche: false }; // 18+
}

function computeTaschengeld(v: Record<string, number>): Record<string, number | string> {
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
  const empfMitte = Math.round((empf.min + empf.max) / 2 * 100) / 100;

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
    bewertungTG = "Leicht ueber der Empfehlung – gut, wenn du es sinnvoll aufteilst";
  } else {
    bewertungTG = "Deutlich ueber der Empfehlung – umso wichtiger, smart zu sparen!";
  }

  // ── Fixkosten ──
  const fixkosten = handykosten + streaming + mobilitaet + schulmaterial;
  const fixkostenPct = gesamtbudget > 0 ? Math.round(fixkosten / gesamtbudget * 1000) / 10 : 0;

  // ── Restbudget ──
  const restNachFix = gesamtbudget - fixkosten;

  // ── 50-30-20 Aufteilung (angepasst fuer Jugendliche) ──
  // Bedarf (50%): Handy, Fahrkarte, Schulmaterial
  // Freizeit (30%): Ausgehen, Hobbys, Snacks, Kino
  // Sparen (20%): ETF, Sparziel, Notgroschen
  const budgetBedarf = Math.round(gesamtbudget * 0.50 * 100) / 100;
  const budgetFreizeit = Math.round(gesamtbudget * 0.30 * 100) / 100;
  const budgetSparen = Math.round(gesamtbudget * 0.20 * 100) / 100;

  // ── Bewertung Fixkosten ──
  let bewertungFix: string;
  if (fixkostenPct <= 50) {
    bewertungFix = "Deine Fixkosten sind im Rahmen – gut!";
  } else if (fixkostenPct <= 70) {
    bewertungFix = "Fixkosten sind hoch – pruefe, ob du Streaming oder Handy guenstiger bekommst";
  } else {
    bewertungFix = "Fixkosten fressen fast alles auf – dringend Einsparpotenzial suchen!";
  }

  // ── Freizeit-Budget nach Fixkosten ──
  const freizeitReal = Math.max(0, Math.round((restNachFix * 0.6) * 100) / 100);
  const sparenReal = Math.max(0, Math.round((restNachFix * 0.4) * 100) / 100);

  // ── Sparziel-Analyse ──
  const sparrateNoetig = sparzeit > 0 ? Math.round(sparziel / sparzeit * 100) / 100 : 0;
  const monateReal = sparenReal > 0 ? Math.ceil(sparziel / sparenReal) : 0;

  let bewertungSparziel: string;
  if (sparziel === 0) {
    bewertungSparziel = "Kein Sparziel angegeben – setz dir eins, es motiviert!";
  } else if (sparenReal >= sparrateNoetig) {
    bewertungSparziel = "Sparziel erreichbar in " + sparzeit + " Monaten – top!";
  } else if (monateReal <= sparzeit * 1.5) {
    bewertungSparziel = "Dauert etwas laenger (" + monateReal + " Monate) – aber machbar!";
  } else {
    bewertungSparziel = "Sparziel ambitioniert – Nebenjob oder laengeren Zeitraum ueberlegen";
  }

  // ── Nebenjob-Potenzial ──
  // Mindestlohn 2025: 12,82€/h, unter 18: ca. 8-10€/h typisch
  const stundenlohn = alter < 18 ? 9 : 12.82;
  const maxStundenWoche = alter < 16 ? 0 : (alter < 18 ? 10 : 20);
  const nebenjobPotenzial = Math.round(stundenlohn * maxStundenWoche * 4.33);

  let nebenjobTipp: string;
  if (alter < 16) {
    nebenjobTipp = "Unter 16: Minijobs eingeschraenkt – Nachbarschaftshilfe, Babysitten moeglich";
  } else if (alter < 18) {
    nebenjobTipp = "16-17 J.: Max. 10h/Woche moeglich (Jugendarbeitsschutz) – ca. " + nebenjobPotenzial + " EUR/Monat";
  } else if (status === 2) {
    nebenjobTipp = "Als Student: Bis 20h/Woche als Werkstudent – ca. " + nebenjobPotenzial + " EUR/Monat moeglich";
  } else {
    nebenjobTipp = "Als Erwachsener: Minijob bis 556 EUR/Monat steuerfrei (2025)";
  }

  // ── Spar-Ideen Text ──
  let sparIdeen: string;
  if (alter <= 14) {
    sparIdeen = "Spardose, Tagesgeldkonto, Wunschliste fuehren";
  } else if (alter <= 17) {
    sparIdeen = "Juniordepot/ETF-Sparplan (mit Eltern), Tagesgeld, 50€-Challenge";
  } else {
    sparIdeen = "ETF-Sparplan (ab 1 EUR/Monat), Tagesgeld, automatischer Dauerauftrag";
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
function computeNotgroschen(v: Record<string, number>): Record<string, number | string> {
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
  const fixkosten = miete + nebenkosten + versicherungen + mobilitaet + lebensmittel + sonstiges;

  // ── Empfohlene Monate je nach Status ──
  // Angestellt: 3-6 Monate, Selbststaendig: 6-12, Student: 2-3, Azubi: 2-3
  let empfMonateMin: number;
  let empfMonateMax: number;
  let statusText: string;
  if (status === 1) {
    empfMonateMin = 6; empfMonateMax = 12;
    statusText = "Selbststaendig – hoehere Absicherung empfohlen (6-12 Monate)";
  } else if (status === 2) {
    empfMonateMin = 2; empfMonateMax = 3;
    statusText = "Student/in – 2-3 Monate reichen meist aus";
  } else if (status === 3) {
    empfMonateMin = 2; empfMonateMax = 3;
    statusText = "Azubi – 2-3 Monate als Grundabsicherung";
  } else {
    empfMonateMin = 3; empfMonateMax = 6;
    statusText = "Angestellt – 3-6 Monate sind der Goldstandard";
  }

  // ── Risikozuschlaege ──
  let zuschlagAuto = 0;
  let zuschlagHaustier = 0;
  if (auto === 1) zuschlagAuto = 1500; // Autoreparatur-Puffer
  if (haustier === 1) zuschlagHaustier = 500; // Tierarzt-Puffer

  // ── Notgroschen berechnen ──
  const notgroschenMin = fixkosten * empfMonateMin + zuschlagAuto + zuschlagHaustier;
  const notgroschenMax = fixkosten * empfMonateMax + zuschlagAuto + zuschlagHaustier;
  const notgroschenEmpf = Math.round((notgroschenMin + notgroschenMax) / 2);

  // ── Aktueller Stand ──
  const differenz = vorhanden - notgroschenEmpf;
  const fortschrittPct = notgroschenEmpf > 0
    ? Math.min(100, Math.round(vorhanden / notgroschenEmpf * 1000) / 10)
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
    bewertung = "Noch kein Notgroschen – starte heute, auch mit kleinen Betraegen!";
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
  const fixkostenQuote = netto > 0 ? Math.round(fixkosten / netto * 1000) / 10 : 0;

  // ── Sparquote ──
  const sparquote = netto > 0 ? Math.round(sparrate / netto * 1000) / 10 : 0;

  // ── Empfehlung Tagesgeld ──
  let tagesgeldTipp: string;
  if (notgroschenEmpf < 3000) {
    tagesgeldTipp = "Tagesgeld reicht – z.B. Trade Republic, ING, DKB (3-3,5% Zinsen)";
  } else if (notgroschenEmpf < 10000) {
    tagesgeldTipp = "Tagesgeld ideal – Zinsen von ca. " + tagesgeldErtrag + " EUR/Jahr mitnehmen";
  } else {
    tagesgeldTipp = "Ggf. auf 2 Tagesgeldkonten aufteilen (Einlagensicherung beachten)";
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
const MJ_KV_AG = 0.13;       // Pauschale KV Arbeitgeber
const MJ_RV_AG = 0.15;       // Pauschale RV Arbeitgeber
const MJ_STEUER_AG = 0.02;   // Pauschsteuer
const MJ_U1 = 0.011;         // Umlage U1
const MJ_U2 = 0.0022;        // Umlage U2
const MJ_INSOLVENZ = 0.0006; // Insolvenzgeldumlage
const MJ_RV_AN = 0.036;      // RV-Eigenanteil AN (bei RV-Pflicht)

// Minijob-Grenze 2025
const MINIJOB_GRENZE = 556;
// Midijob-Obergrenze
const MIDIJOB_GRENZE = 2000;
// Mindestlohn 2025
const MINDESTLOHN_2025 = 12.82;

// Gleitzonenfaktor F 2025
const GLEIT_F = 0.6847;

// Volle SV-Saetze 2025 (AN-Anteil)
const SV_KV_AN = 0.073;  // + Zusatzbeitrag ~0.85%
const SV_KV_ZUSATZ_AN = 0.0085;
const SV_PV_AN = 0.0175; // ohne Kinder: +0.6% Zuschlag
const SV_RV_AN = 0.093;
const SV_ALV_AN = 0.013;

function computeNebenjob(v: Record<string, number>): Record<string, number | string> {
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
    kategorieDetail = "Bis " + MINIJOB_GRENZE + " EUR/Monat – fuer dich steuerfrei!";
  } else if (bruttoMonat <= MIDIJOB_GRENZE) {
    kategorie = "Midijob (Uebergangsbereich)";
    kategorieDetail = bruttoMonat.toFixed(0) + " EUR liegt zwischen " + MINIJOB_GRENZE + " und " + MIDIJOB_GRENZE + " EUR – reduzierte SV-Beitraege";
  } else {
    kategorie = "Regulaere Beschaeftigung";
    kategorieDetail = "Ueber " + MIDIJOB_GRENZE + " EUR – volle Sozialabgaben und Steuerpflicht";
  }

  // ── Abgaben berechnen ──
  let anRV = 0, anKV = 0, anPV = 0, anALV = 0, anSteuer = 0;
  let agRV = 0, agKV = 0, agSteuer = 0, agU1 = 0, agU2 = 0, agInsolvenz = 0;
  let agGesamt = 0, anGesamt = 0;
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
      anSteuer = Math.round(bruttoMonat * 0.20 * 100) / 100;
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
    const gleitFaktor = (bruttoMonat - MINIJOB_GRENZE) / (MIDIJOB_GRENZE - MINIJOB_GRENZE);

    // Volle AN-Saetze
    const kvAnSatz = SV_KV_AN + SV_KV_ZUSATZ_AN; // ~8,15%
    const pvAnSatz = SV_PV_AN + (kinderlos === 1 ? 0.006 : 0); // 1,75% (+0,6%)
    const rvAnSatz = SV_RV_AN;  // 9,3%
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
      anSteuer = Math.round(bruttoMonat * 0.20 * 100) / 100;
      anGesamt += anSteuer;
    }

    nettoMonat = Math.round((bruttoMonat - anGesamt) * 100) / 100;

  } else {
    // ── Regulaer (> 2000€) ──
    anKV = Math.round(bruttoMonat * (SV_KV_AN + SV_KV_ZUSATZ_AN) * 100) / 100;
    anPV = Math.round(bruttoMonat * (SV_PV_AN + (kinderlos === 1 ? 0.006 : 0)) * 100) / 100;
    anRV = Math.round(bruttoMonat * SV_RV_AN * 100) / 100;
    anALV = Math.round(bruttoMonat * SV_ALV_AN * 100) / 100;
    anGesamt = anKV + anPV + anRV + anALV;

    if (hatHauptjob === 1) {
      anSteuer = Math.round(bruttoMonat * 0.25 * 100) / 100;
    }
    anGesamt += anSteuer;

    agKV = Math.round(bruttoMonat * (SV_KV_AN + SV_KV_ZUSATZ_AN) * 100) / 100;
    agRV = Math.round(bruttoMonat * SV_RV_AN * 100) / 100;
    agGesamt = agKV + agRV + Math.round(bruttoMonat * SV_ALV_AN * 100) / 100
      + Math.round(bruttoMonat * SV_PV_AN * 100) / 100
      + Math.round(bruttoMonat * MJ_U1 * 100) / 100
      + Math.round(bruttoMonat * MJ_U2 * 100) / 100;

    nettoMonat = Math.round((bruttoMonat - anGesamt) * 100) / 100;
  }

  const nettoJahr = Math.round(nettoMonat * 12 * 100) / 100;
  const nettoStunde = stundenMonat > 0 ? Math.round(nettoMonat / stundenMonat * 100) / 100 : 0;
  const abgabenQuote = bruttoMonat > 0 ? Math.round(anGesamt / bruttoMonat * 1000) / 10 : 0;

  // ── Maximal moegliche Stunden bei Minijob-Grenze ──
  const maxStundenMinijob = stundenlohn > 0 ? Math.floor(MINIJOB_GRENZE / stundenlohn / 4.33 * 10) / 10 : 0;

  // ── Bewertung / Tipp ──
  let bewertung: string;
  if (kategorie === "Minijob") {
    if (rvBefreiung === 1) {
      bewertung = "Steuerfrei & abgabenfrei – du bekommst 100% netto ausgezahlt!";
    } else {
      bewertung = "Steuerfrei, aber " + (jobtyp === 1 ? "13,6%" : "3,6%") + " RV-Eigenanteil – dafuer Rentenansprueche!";
    }
  } else if (kategorie === "Werkstudent") {
    bewertung = hatHauptjob === 1
      ? "Werkstudent mit Hauptjob: RV + Lohnsteuer (StKl. VI) – pruefe ob Minijob guenstiger waere"
      : "Werkstudent: Nur 9,3% RV – sehr guenstig! Achte auf die 20h-Grenze.";
  } else if (kategorie.includes("Midijob")) {
    bewertung = "Reduzierte SV-Beitraege in der Gleitzone – ab " + (MINIJOB_GRENZE + 1) + " EUR lohnt sich mehr arbeiten";
  } else {
    bewertung = "Volle Abgaben – pruefe ob ein 2. Minijob beim gleichen AG guenstiger waere";
  }

  // ── Jahres-Steuerfreibetrag Check ──
  const grundfreibetrag = 12096; // 2025
  let steuerHinweis: string;
  if (bruttoJahr <= grundfreibetrag && hatHauptjob === 0) {
    steuerHinweis = "Unter dem Grundfreibetrag (" + grundfreibetrag + " EUR) – keine Einkommensteuer!";
  } else if (hatHauptjob === 1) {
    steuerHinweis = "Bei Hauptjob: Nebenjob wird ueber Steuerklasse VI versteuert – Steuererklaerung machen!";
  } else {
    steuerHinweis = "Ueber Grundfreibetrag – Lohnsteuer faellt an (ggf. per Steuererklaerung zurueckholen)";
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
const BAFOEG_WOHN_EIGEN = 380;  // eigene Wohnung
const BAFOEG_WOHN_ELTERN = 59;  // bei Eltern
const BAFOEG_KV_ZUSCHLAG = 102; // eigene KV (ab 25)
const BAFOEG_PV_ZUSCHLAG = 35;  // eigene PV (ab 25)

// Freibetraege Elterneinkommen (monatlich)
const BAFOEG_FREI_VERHEIRATET = 2540; // beide Eltern zusammen
const BAFOEG_FREI_ALLEINERZIEHEND = 1690; // pro Elternteil
const BAFOEG_FREI_GESCHWISTER = 770; // pro Geschwister (nicht in foerderfaehiger Ausbildung)

// Eigenes Einkommen
const BAFOEG_FREI_EIGEN = 353; // monatlich
const BAFOEG_WERBUNGSKOSTEN = 1230; // jaehrlich
const BAFOEG_SOZIALPAUSCHALE = 0.223; // 22,3%
const BAFOEG_VERMOEGEN_FREI = 15000;

function computeBafoeg(v: Record<string, number>): Record<string, number | string> {
  const ausbildungsart = v.ausbildungsart ?? 0; // 0=Studium, 1=Schule (auswärts), 2=Schule (Eltern)
  const wohnsituation = v.wohnsituation ?? 0;   // 0=eigene Wohnung, 1=bei Eltern
  const eigenKV = v.eigen_kv ?? 0;              // 0=familienversichert, 1=eigene KV
  const elternBrutto = v.eltern_brutto ?? 40000; // Jahresbrutto Eltern
  const elternStatus = v.eltern_status ?? 0;     // 0=verheiratet, 1=alleinerziehend/getrennt
  const geschwisterFrei = v.geschwister_frei ?? 0; // Geschwister OHNE foerderfaehige Ausbildung (erhoehen Freibetrag)
  const geschwisterAusb = v.geschwister_ausb ?? 0; // Geschwister IN foerderfaehiger Ausbildung (teilen anrechnung)
  const eigenEinkommen = v.eigen_einkommen ?? 0; // monatliches Bruttoeinkommen
  const vermoegen = v.vermoegen ?? 0;
  const partnerEinkommen = v.partner_einkommen ?? 0; // Ehepartner/eingetragener LP

  // ── 1. Bedarf berechnen ──
  const wohnpauschale = wohnsituation === 0 ? BAFOEG_WOHN_EIGEN : BAFOEG_WOHN_ELTERN;
  const kvZuschlag = eigenKV === 1 ? BAFOEG_KV_ZUSCHLAG : 0;
  const pvZuschlag = eigenKV === 1 ? BAFOEG_PV_ZUSCHLAG : 0;
  const gesamtBedarf = BAFOEG_GRUNDBEDARF + wohnpauschale + kvZuschlag + pvZuschlag;

  // ── 2. Elterneinkommen anrechnen ──
  // Schritt 1: Brutto -> bereinigtes Netto (jaehrlich)
  const elternNachWK = Math.max(0, elternBrutto - BAFOEG_WERBUNGSKOSTEN);
  const elternNachSozi = Math.round(elternNachWK * (1 - BAFOEG_SOZIALPAUSCHALE));
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
  const anrechnungsSatz = 0.50 + 0.05 * Math.max(0, kinderMitAnspruch - 1);
  // Nicht ueber 1.0 (theoretisch bei >10 Kindern, aber cap)
  const effAnrechnungsSatz = Math.min(1, anrechnungsSatz);

  const elternAnrechnung = Math.round(elternUeberhang * effAnrechnungsSatz);

  // Bei Geschwistern in Ausbildung: anrechenbarer Betrag wird geteilt
  const elternAnrechnungProKind = kinderMitAnspruch > 1
    ? Math.round(elternAnrechnung / kinderMitAnspruch)
    : elternAnrechnung;

  // ── 3. Eigenes Einkommen anrechnen ──
  // Monatlich: Brutto - WK anteilig - Sozialpauschale - Freibetrag
  const eigenWKMonat = Math.round(BAFOEG_WERBUNGSKOSTEN / 12);
  const eigenNachWK = Math.max(0, eigenEinkommen - eigenWKMonat);
  const eigenNachSozi = Math.round(eigenNachWK * (1 - BAFOEG_SOZIALPAUSCHALE));
  const eigenAnrechnung = Math.max(0, eigenNachSozi - BAFOEG_FREI_EIGEN);

  // ── 4. Vermoegen anrechnen ──
  const vermoegenAnrechnung = vermoegen > BAFOEG_VERMOEGEN_FREI
    ? Math.round((vermoegen - BAFOEG_VERMOEGEN_FREI) / 12) // auf 12 Monate verteilt
    : 0;

  // ── 5. Partner-Einkommen anrechnen ──
  const partnerNachWK = Math.max(0, partnerEinkommen * 12 - BAFOEG_WERBUNGSKOSTEN);
  const partnerNachSozi = Math.round(partnerNachWK * (1 - BAFOEG_SOZIALPAUSCHALE) / 12);
  const partnerFreibetrag = 850; // Ehepartner-Freibetrag
  const partnerAnrechnung = Math.max(0, partnerNachSozi - partnerFreibetrag);

  // ── 6. BAföG berechnen ──
  const gesamtAnrechnung = elternAnrechnungProKind + eigenAnrechnung + vermoegenAnrechnung + partnerAnrechnung;
  const bafoegMonat = Math.max(0, gesamtBedarf - gesamtAnrechnung);
  // BAföG-Mindestbetrag: unter 10€ wird nicht gezahlt
  const bafoegEffektiv = bafoegMonat >= 10 ? bafoegMonat : 0;
  const bafoegJahr = bafoegEffektiv * 12;

  // ── 7. Zusammensetzung ──
  const zuschussAnteil = Math.round(bafoegEffektiv * 0.5); // 50% Zuschuss
  const darlehenAnteil = bafoegEffektiv - zuschussAnteil;    // 50% Darlehen
  // Max. Rueckzahlung: 10.010€ (gedeckelt)
  const maxRueckzahlung = Math.min(darlehenAnteil * 12 * 5, 10010); // 5 Jahre Regelstudienzeit

  // ── 8. Bewertung ──
  let bewertung: string;
  if (bafoegEffektiv >= gesamtBedarf * 0.9) {
    bewertung = "Fast Hoechstsatz! Du bekommst nahezu den vollen Betrag.";
  } else if (bafoegEffektiv >= gesamtBedarf * 0.5) {
    bewertung = "Gute Foerderung – deckt einen Grossteil deiner Kosten.";
  } else if (bafoegEffektiv > 0) {
    bewertung = "Teilfoerderung – ergaenze mit Minijob (bis 556 EUR ohne Kuerzung).";
  } else if (elternNettoMonat <= elternFreibetrag * 1.1) {
    bewertung = "Knapp ueber der Grenze – Antrag trotzdem stellen, es kann sich aendern!";
  } else {
    bewertung = "Kein Anspruch bei diesem Elterneinkommen. Alternativen: Stipendium, KfW-Studienkredit.";
  }

  // ── Minijob-kompatibel? ──
  const minijobOK = eigenEinkommen <= 556
    ? "Ja – Minijob bis 556 EUR/Monat ohne BAfoeg-Kuerzung moeglich"
    : "Achtung: Einkommen ueber 556 EUR wird teilweise angerechnet!";

  // ── Vermoegens-Check ──
  const vermoegenOK = vermoegen <= BAFOEG_VERMOEGEN_FREI
    ? "Im Freibetrag (" + BAFOEG_VERMOEGEN_FREI.toLocaleString("de-DE") + " EUR) – kein Abzug"
    : "Ueber Freibetrag: " + Math.round((vermoegen - BAFOEG_VERMOEGEN_FREI)).toLocaleString("de-DE") + " EUR werden angerechnet";

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
  0: 9,   // bundesweit (Minimum)
  1: 13,  // Bayern
  2: 12,  // Baden-Wuerttemberg
  3: 11,  // NRW
  4: 11,  // Niedersachsen
  5: 10,  // Berlin
  6: 11,  // Hessen
  7: 12,  // Saarland
  8: 11,  // Sachsen
  9: 11,  // Thueringen
  10: 10, // Hamburg
  11: 10, // Bremen
  12: 10, // Schleswig-Holstein
  13: 11, // Rheinland-Pfalz
  14: 11, // Sachsen-Anhalt
  15: 11, // Mecklenburg-Vorpommern
  16: 12, // Brandenburg
};

function computeStundenlohn(v: Record<string, number>): Record<string, number | string> {
  const monatsgehalt = v.monatsgehalt ?? 3000;
  const wochenstunden = v.wochenstunden ?? 40;
  const urlaubstage = v.urlaubstage ?? 28;
  const bundesland = v.bundesland ?? 0;
  const weihnachtsgeld = v.weihnachtsgeld ?? 0; // in % vom Monatsgehalt (0=kein, 50=halbes, 100=volles)
  const urlaubsgeld = v.urlaubsgeld ?? 0;        // absolute EUR
  const bonus = v.bonus ?? 0;                     // jaehrlich EUR
  const arbeitstageWoche = v.arbeitstage ?? 5;    // 5 oder 6 Tage

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
  const arbeitstageJahrNetto = arbeitstageJahrBrutto - urlaubstage - feiertagArbeitstage;
  const stundenProTag = wochenstunden / arbeitstageWoche;
  const arbeitsstundenJahr = Math.round(arbeitstageJahrNetto * stundenProTag);
  const arbeitsstundenJahrBrutto = Math.round(arbeitstageJahrBrutto * stundenProTag);

  // ── Stundenlohn-Varianten ──
  // Formaler Stundenlohn (ohne Urlaub/Feiertage)
  const stundenlohnFormal = wochenstunden > 0
    ? Math.round(monatsgehalt / (wochenstunden * 4.33) * 100) / 100
    : 0;

  // Effektiver Stundenlohn (Jahresgehalt OHNE Sonderzahlungen / tatsächliche Arbeitsstunden)
  const stundenlohnEffektiv = arbeitsstundenJahr > 0
    ? Math.round(jahresgehaltOhne / arbeitsstundenJahr * 100) / 100
    : 0;

  // Effektiver Stundenlohn MIT Sonderzahlungen
  const stundenlohnMitSonder = arbeitsstundenJahr > 0
    ? Math.round(jahresgehaltMit / arbeitsstundenJahr * 100) / 100
    : 0;

  // ── Tages- und Wochenverdienst ──
  const tagesverdienst = stundenProTag > 0
    ? Math.round(stundenlohnFormal * stundenProTag * 100) / 100
    : 0;
  const wochenverdienst = Math.round(stundenlohnFormal * wochenstunden * 100) / 100;

  // ── Mindestlohn-Check (2025: 12,82€) ──
  const mindestlohn = 12.82;
  let mindestlohnCheck: string;
  if (stundenlohnFormal >= mindestlohn * 1.5) {
    mindestlohnCheck = "Deutlich ueber Mindestlohn (" + mindestlohn + " EUR) – gut!";
  } else if (stundenlohnFormal >= mindestlohn) {
    mindestlohnCheck = "Ueber Mindestlohn (" + mindestlohn + " EUR) – aber wenig Puffer";
  } else if (stundenlohnFormal > 0) {
    mindestlohnCheck = "ACHTUNG: Unter dem gesetzlichen Mindestlohn von " + mindestlohn + " EUR!";
  } else {
    mindestlohnCheck = "Kein Gehalt angegeben";
  }

  // ── Vergleich: Was bringen Sonderzahlungen pro Stunde? ──
  const sonderProStunde = arbeitsstundenJahr > 0
    ? Math.round(sonderzahlungen / arbeitsstundenJahr * 100) / 100
    : 0;

  // ── Arbeitszeitanalyse ──
  const jahresarbeitszeitStd = arbeitsstundenJahrBrutto;
  const freizeitEffekt = arbeitsstundenJahrBrutto - arbeitsstundenJahr;

  // ── Bewertung ──
  let bewertung: string;
  const differenz = stundenlohnMitSonder - stundenlohnFormal;
  if (differenz > 5) {
    bewertung = "Sonderzahlungen & Freizeit erhoehen deinen echten Stundenlohn um " + differenz.toFixed(2) + " EUR!";
  } else if (differenz > 1) {
    bewertung = "Dein effektiver Stundenlohn ist " + differenz.toFixed(2) + " EUR hoeher als der formale.";
  } else {
    bewertung = "Kaum Unterschied – keine/wenige Sonderzahlungen oder wenig Urlaub/Feiertage.";
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
const CO2_BENZIN = 2.37;  // kg CO2 pro Liter Benzin
const CO2_DIESEL = 2.65;  // kg CO2 pro Liter Diesel
const CO2_STROM = 0.380;  // kg CO2 pro kWh (DE-Strommix 2025)

// Pendlerpauschale 2025
const PENDLER_BIS20 = 0.30; // €/km bis 20km
const PENDLER_AB21 = 0.38;  // €/km ab 21km

// Deutschlandticket 2025
const DTICKET_PREIS = 58; // €/Monat (2025)

function computeSprit(v: Record<string, number>): Record<string, number | string> {
  const strecke = v.strecke ?? 25;           // km einfach
  const kraftstoff = v.kraftstoff ?? 0;       // 0=Benzin, 1=Diesel, 2=E-Auto, 3=Hybrid
  const verbrauch = v.verbrauch ?? 7;         // l/100km oder kWh/100km bei E-Auto
  const spritpreis = v.spritpreis ?? 1.75;    // €/Liter oder €/kWh
  const fahrtenWoche = v.fahrten ?? 10;       // Hin+Rueck-Fahrten pro Woche
  const mitfahrer = v.mitfahrer ?? 0;         // Anzahl Mitfahrer (Kosten teilen)
  const istPendler = v.ist_pendler ?? 1;      // 0=Nein, 1=Ja (Pendlerpauschale berechnen)
  const steuersatz = v.steuersatz ?? 30;      // Grenzsteuersatz in %

  // ── Kraftstoff-Label ──
  const kraftstoffLabel = ["Benzin", "Diesel", "E-Auto (Strom)", "Hybrid"][kraftstoff] ?? "Benzin";
  const einheit = kraftstoff === 2 ? "kWh/100km" : "l/100km";
  const preisEinheit = kraftstoff === 2 ? "EUR/kWh" : "EUR/Liter";

  // ── Kosten pro Fahrt ──
  const verbrauchProFahrt = strecke * verbrauch / 100;
  const kostenProFahrt = Math.round(verbrauchProFahrt * spritpreis * 100) / 100;

  // ── Kosten pro km ──
  const kostenProKm = Math.round(verbrauch / 100 * spritpreis * 100) / 100;

  // ── Zeitraeume ──
  const kostenWoche = Math.round(kostenProFahrt * fahrtenWoche * 100) / 100;
  const kostenMonat = Math.round(kostenWoche * 4.33 * 100) / 100;
  const kostenJahr = Math.round(kostenWoche * 52 * 100) / 100;

  // ── Mitfahrer-Aufteilung ──
  const personenGesamt = 1 + mitfahrer;
  const kostenProPerson = Math.round(kostenMonat / personenGesamt * 100) / 100;
  const ersparnisMitfahrer = Math.round((kostenMonat - kostenProPerson) * 100) / 100;

  // ── Verbrauch pro Fahrt ──
  const verbrauchEinheit = kraftstoff === 2 ? "kWh" : "Liter";

  // ── CO2-Emissionen ──
  let co2ProKm: number;
  if (kraftstoff === 0) co2ProKm = verbrauch / 100 * CO2_BENZIN;
  else if (kraftstoff === 1) co2ProKm = verbrauch / 100 * CO2_DIESEL;
  else if (kraftstoff === 2) co2ProKm = verbrauch / 100 * CO2_STROM;
  else co2ProKm = verbrauch / 100 * CO2_BENZIN * 0.7; // Hybrid ~30% weniger
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
      pendlerJahr = Math.round((20 * PENDLER_BIS20 + (strecke - 20) * PENDLER_AB21) * arbeitstage);
    }
    // Steuerersparnis = Pendlerpauschale × Grenzsteuersatz
    pendlerErsparnis = Math.round(pendlerJahr * (steuersatz / 100));
    pendlerText = pendlerErsparnis + " EUR Steuerersparnis pro Jahr (bei " + steuersatz + "% Grenzsteuersatz)";
  }

  // ── Vergleich mit Deutschlandticket ──
  const dticketJahr = DTICKET_PREIS * 12;
  const diffDticket = kostenJahr - dticketJahr;
  let dticketVergleich: string;
  if (diffDticket > 500) {
    dticketVergleich = "Deutschlandticket spart " + Math.round(diffDticket) + " EUR/Jahr – deutlich guenstiger!";
  } else if (diffDticket > 0) {
    dticketVergleich = "Deutschlandticket spart " + Math.round(diffDticket) + " EUR/Jahr – lohnt sich, wenn OEPNV moeglich";
  } else {
    dticketVergleich = "Auto ist guenstiger als Deutschlandticket (" + dticketJahr + " EUR/Jahr)";
  }

  // ── Kosten ohne vs. mit Pendlerpauschale ──
  const realKostenJahr = kostenJahr - pendlerErsparnis;

  // ── Bewertung ──
  let bewertung: string;
  if (kostenProKm <= 0.05) {
    bewertung = "Sehr guenstig! E-Auto oder sparsamer Verbrauch zahlt sich aus.";
  } else if (kostenProKm <= 0.10) {
    bewertung = "Guter Verbrauch – moderate Kosten pro Kilometer.";
  } else if (kostenProKm <= 0.15) {
    bewertung = "Durchschnittliche Kosten – Einsparpotenzial durch Fahrweise und Reifendruck.";
  } else {
    bewertung = "Hohe Kosten pro km – pruefe Verbrauch, Fahrgemeinschaft oder Alternative.";
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
  "2015": 0.3, "2016": 0.5, "2017": 1.5, "2018": 1.8, "2019": 1.4,
  "2020": 0.5, "2021": 3.1, "2022": 6.9, "2023": 5.9, "2024": 2.2, "2025": 2.3,
};
const INFLATION_SCHNITT_10J = 2.5; // Ø 2015–2024
const INFLATION_SCHNITT_5J = 3.7;  // Ø 2020–2024 (inkl. Krisenjahre)
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
  const betragNachGebuehr = rd(
    (betrag - wechselgebuehr) * kurs,
  );

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
    sparrateMonat =
      nochAufzubauen / ((Math.pow(1 + rSpar, nSpar) - 1) / rSpar);
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

function computeInflation(values: Record<string, number>): Record<string, number | string> {
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
  const realzins = ((1 + z) / (1 + r) - 1);

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
  const warenkorbZukunft = WARENKORB_POSTEN.map(p => ({
    name: p.name,
    heute: p.preis,
    zukunft: p.preis * Math.pow(1 + r, jahre),
  }));
  // Zeige die Top-5 mit dem höchsten absoluten Preisanstieg
  const topWaren = [...warenkorbZukunft]
    .sort((a, b) => (b.zukunft - b.heute) - (a.zukunft - a.heute))
    .slice(0, 5);
  const warenkorbText = topWaren
    .map(w => `${w.name}: ${w.heute.toFixed(2)}€ → ${w.zukunft.toFixed(2)}€ (+${(w.zukunft - w.heute).toFixed(2)}€)`)
    .join(" | ");

  // ── Historische Inflation ─────────────────────────────────────
  const histJahre = Object.keys(INFLATION_HISTORISCH).sort();
  const histText = histJahre.map(j => `${j}: ${INFLATION_HISTORISCH[j]}%`).join(" | ");

  // ── Verdopplungszeit (Rule of 72) ─────────────────────────────
  const verdopplungInflation = inflationsrate > 0 ? 72 / inflationsrate : 999;
  const halbierungKaufkraft = verdopplungInflation; // gleiche Formel

  // ── Zeitachse: Kaufkraft pro Jahr ─────────────────────────────
  const zeitachseArr: string[] = [];
  const schritte = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];
  for (const j of schritte) {
    if (j > jahre) break;
    const kk = betrag / Math.pow(1 + r, j);
    const verlust = ((1 - 1 / Math.pow(1 + r, j)) * 100);
    zeitachseArr.push(`${j}J: ${Math.round(kk).toLocaleString("de-DE")}€ (−${verlust.toFixed(1)}%)`);
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

  const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
    sparplan_verlust: sparrate > 0 ? `${fmt(sparplanEingezahlt - sparplanReal)} €` : "–",

    // Gehalt
    gehalt_zukunft_nominal: gehalt > 0 ? `${fmt(gehaltZukunftNominal)} €` : "–",
    gehalt_zukunft_real: gehalt > 0 ? `${fmt(gehaltZukunftReal)} €` : "–",
    gehalt_kaufkraft_verlust_monat: gehalt > 0 ? `${fmt(Math.abs(gehaltKaufkraftVerlustMonat))} €` : "–",
    gehalt_kaufkraft_verlust_jahr: gehalt > 0 ? `${fmt(Math.abs(gehaltKaufkraftVerlustJahr))} €` : "–",
    gehalt_text: gehalt > 0 ? gehaltText : "Gib dein Brutto-Monatsgehalt ein, um die Gehalts-Analyse zu sehen.",

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
    metaTitle: "Brutto-Netto-Rechner 2025: Gehalt berechnen | BeAFox",
    metaDescription:
      "Wie viel bleibt netto vom Brutto? Berechne dein Gehalt 2025 mit Steuerklasse, Sozialabgaben und KV-Zusatzbeitrag — kostenlos und ohne Anmeldung.",
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
    tips: [
      "Der Grundfreibetrag 2025 liegt bei 12.096 € pro Jahr — auf diesen Betrag zahlst du null Einkommensteuer. Bei einem Monatsbrutto unter ca. 1.008 € faellt so gut wie keine Lohnsteuer an.",
      "Beas Tipp: Vergleiche den KV-Zusatzbeitrag deiner Krankenkasse mit dem Durchschnitt von ca. 2,5 %. Ein Wechsel zu einer guenstigeren Kasse kann dir 50 bis 150 € im Jahr sparen — bei gleichem Leistungsumfang.",
      "Kirchensteuer laesst sich einfach berechnen: 8 % deiner Lohnsteuer in Baden-Wuerttemberg und Bayern, 9 % in allen anderen Bundeslaendern. Bei 200 € Lohnsteuer sind das 16 bis 18 € pro Monat.",
      "Dein erster Gehaltszettel zeigt etwa 20 verschiedene Positionen. Die groessten Brocken: Rentenversicherung (9,3 % deines Bruttos), Krankenversicherung (ca. 8,5 %) und Lohnsteuer. Zusammen machen sie rund 80 % aller Abzuege aus.",
      "Ab 520,01 € im Nebenjob wird er steuer- und sozialversicherungspflichtig. Nutze unseren Nebenjob-Steuer-Rechner um zu pruefen, wie sich ein Zweitjob auf dein Gesamtnetto auswirkt.",
      "Beas Tipp: Wenn du 200 € mehr brutto verhandelst, landen davon je nach Steuerklasse nur 100 bis 130 € netto auf deinem Konto. Rechne vor der Gehaltsverhandlung durch, was die Erhoehung wirklich bringt.",
      "Der Solidaritaetszuschlag faellt 2025 erst ab ca. 70.000 € Jahresbrutto an. Bei einem typischen Einstiegsgehalt von 35.000 bis 45.000 € zahlst du keinen Cent Soli.",
    ],
    intro: [
      "Von 2.500 € brutto bleiben in Steuerklasse I nur ca. 1.700 € netto — fast ein Drittel deines Gehalts geht an Steuern und Sozialabgaben. Wie viel genau, haengt von deiner Steuerklasse, deinem Bundesland, dem KV-Zusatzbeitrag und deinem Alter ab.",
      "Gerade beim ersten Job oder einem neuen Jobangebot ist das entscheidend: Dein Netto bestimmt, wie viel du fuer Miete, Sparen und Leben uebrig hast. Mit dem Rechner findest du in 30 Sekunden heraus, was von deinem Brutto wirklich auf dem Konto landet — aufgeschluesselt nach Lohnsteuer, Rentenversicherung, Krankenversicherung und allen weiteren Abzuegen.",
      "Der Rechner bildet die Lohnsteuertabelle 2025 nach §32a EStG ab, inklusive Solidaritaetszuschlag, Kirchensteuer und allen vier Sozialversicherungszweigen. Was er nicht beruecksichtigt: Freibetraege aus der Steuererklaerung, geldwerte Vorteile und betriebliche Altersvorsorge.",
    ],
    howItWorks: [
      {
        title: "Brutto-Gehalt eingeben",
        description: "Trag dein monatliches Bruttoegehalt ein — das ist der Betrag aus deinem Arbeitsvertrag, vor allen Abzuegen.",
      },
      {
        title: "Steuerklasse waehlen",
        description: "Ledige und Berufseinsteiger nehmen Klasse I. Deine Steuerklasse bestimmt, wie viel Lohnsteuer dein Arbeitgeber jeden Monat einbehaelt.",
      },
      {
        title: "Bundesland und Kirchensteuer einstellen",
        description: "Dein Bundesland beeinflusst den Kirchensteuersatz (8 % oder 9 %). Wenn du nicht in der Kirche bist, waehle einfach 'Nein'.",
      },
      {
        title: "KV-Zusatzbeitrag pruefen",
        description: "Der Durchschnitt liegt 2025 bei ca. 2,5 %. Deine Kasse kann mehr oder weniger verlangen — den genauen Satz findest du auf deiner Versichertenkarte oder der Kassen-Website.",
      },
      {
        title: "Ergebnis auswerten",
        description: "Du siehst dein Netto plus jede einzelne Abzugsposition. So erkennst du sofort, wo das meiste Geld hinfiesst — und wo du optimieren kannst.",
      },
    ],
    useCases: [
      "Bevor du dein erstes Jobangebot unterschreibst — damit du weisst, was netto uebrig bleibt.",
      "Du willst vor einer Gehaltsverhandlung berechnen, was 200 € mehr brutto wirklich bringen.",
      "Wenn du als Azubi dein Ausbildungsgehalt checkst und wissen willst, wie viel Steuern schon anfallen.",
      "Du vergleichst zwei Jobangebote in verschiedenen Bundeslaendern und willst das Netto nebeneinander sehen.",
      "Bevor du aus der Kirche austreten willst, rechnest du aus, wie viel Kirchensteuer du aktuell zahlst.",
      "Du planst deinen Nebenjob neben dem Studium und willst wissen, ab wann Steuern faellig werden.",
      "Wenn du wissen willst, ob sich ein Krankenkassenwechsel finanziell lohnt.",
    ],
    faqs: [
      {
        question: "Wie berechne ich mein Netto-Gehalt 2025?",
        answer: "Gib dein Monatsbrutto, deine Steuerklasse und dein Bundesland ein. Der Rechner zieht automatisch Lohnsteuer, Soli, Kirchensteuer und alle vier Sozialversicherungen ab. Das Ergebnis ist dein monatliches Netto nach allen Abzuegen.",
      },
      {
        question: "Wie viel Prozent wird vom Brutto abgezogen?",
        answer: "Bei einem typischen Einstiegsgehalt von 2.500 € brutto in Steuerklasse I gehen ca. 30 bis 35 % an Steuern und Sozialabgaben ab. Davon sind rund 20 % Sozialabgaben (Rente, Kranken-, Pflege-, Arbeitslosenversicherung) und 10 bis 15 % Lohnsteuer.",
      },
      {
        question: "Bis zu welchem Gehalt zahle ich keine Lohnsteuer?",
        answer: "Der Grundfreibetrag 2025 liegt bei 12.096 € im Jahr, also ca. 1.008 € im Monat. Unterhalb dieser Grenze faellt in Steuerklasse I keine Lohnsteuer an. Sozialversicherungsbeitraege werden aber trotzdem abgezogen.",
      },
      {
        question: "Was aendert sich am Netto wenn ich die Krankenkasse wechsle?",
        answer: "Nur der KV-Zusatzbeitrag aendert sich — der allgemeine Satz von 14,6 % bleibt gleich. Bei 3.000 € brutto und 1 Prozentpunkt weniger Zusatzbeitrag sparst du ca. 15 € netto im Monat, also 180 € im Jahr. Nutze den Rechner, um den Effekt fuer dein Gehalt durchzuspielen.",
      },
      {
        question: "Lohnt es sich fuer Azubis diesen Rechner zu nutzen?",
        answer: "Auf jeden Fall. Auch auf ein Azubi-Gehalt von z.B. 1.000 € brutto fallen Sozialversicherungsbeitraege von ca. 200 € an. Der Rechner zeigt dir genau, wo dein Geld hinfiesst — und ab welchem Betrag Lohnsteuer dazukommt.",
      },
      {
        question: "Was ist der Unterschied zwischen Steuerklasse I und IV?",
        answer: "Fuer Ledige und Singles sind I und IV identisch in der Berechnung. Klasse IV wird automatisch vergeben, wenn beide Ehepartner etwa gleich viel verdienen. Der Unterschied zeigt sich erst bei III/V: Dort zahlt ein Partner weniger, der andere mehr Lohnsteuer.",
      },
      {
        question: "Wie berechne ich das Netto bei einem Nebenjob?",
        answer: "Ein Minijob bis 520 € bleibt steuer- und sozialversicherungsfrei fuer dich. Verdienst du mehr, wird der Nebenjob in Steuerklasse VI versteuert — das ist die teuerste Klasse. Nutz unseren Nebenjob-Steuer-Rechner fuer die genaue Berechnung.",
      },
    ],
  },
  {
    slug: "sparplan-rechner",
    title: "Sparplan-Rechner",
    metaTitle: "ETF Sparplan Rechner 2025 | BeAFox",
    metaDescription:
      "Berechne die Wertentwicklung deines ETF Sparplans mit Zinseszins, Anfangskapital, Steuern und Teilfreistellung – praezise wie bei Finanzfluss.",
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
    tips: [
      "Eine durchschnittliche Rendite von 7% p.a. ist beim Weltmarkt-ETF (MSCI World) ueber 15+ Jahre realistisch.",
      "Der Zinseszins-Effekt wird mit der Zeit immer staerker – frueh anfangen lohnt sich!",
      "Teilfreistellung: Bei Aktienfonds (mind. 51% Aktien) sind 30% der Gewinne steuerfrei.",
      "Der Sparerpauschbetrag betraegt 1.000 € (Einzelperson) bzw. 2.000 € (Ehepaar) pro Jahr.",
      "Auch 25 € im Monat machen langfristig einen grossen Unterschied – Hauptsache anfangen!",
    ],
    intro: [
      "50 € pro Monat bei 7% Rendite werden in 30 Jahren zu ueber 56.000 € – ohne dass du aktiv am Markt tradest. Das ist der Magie des Zinseszins-Effekts: dein Geld arbeitet fuer dich.",
      "Mit diesem Sparplan-Rechner siehst du, wie viel Vermoegen du aufbaust. Gib deine monatliche Sparrate, eine realistische Rendite und deine Laufzeit ein – der Rechner zeigt dir die Entwicklung mit und ohne Steuern.",
    ],
    howItWorks: [
      {
        title: "Anfangskapital eingeben (optional)",
        description: "Hast du Startkapital auf der hohen Kante? Gib es ein – es wird mitverzinst. Wenn nicht, kannst du bei 0 € anfangen.",
      },
      {
        title: "Sparrate festlegen",
        description: "Wie viel kannst du monatlich, vierteljaehrlich oder jaehrlich sparen? Je hoeher, desto schneller waechst dein Vermoegen – aber auch 50 € im Monat macht einen Unterschied.",
      },
      {
        title: "Rendite realistisch waehlen",
        description: "Bei Aktienfonds (ETF) sind 7% p.a. ueber lange Zeit realistisch. Bei Obligationen/Mischfonds 3-4%. Konservativ rechnen ist besser als zu optimistisch.",
      },
      {
        title: "Laufzeit einstellen",
        description: "Je laenger du sparst, desto mehr profitierst du vom Zinseszins. 10 Jahre, 30 Jahre – der Rechner zeigt die komplette Entwicklung.",
      },
      {
        title: "Steuern optional anpassen",
        description: "Mit Teilfreistellung sparst du Steuern. Nach Abzug deines Sparerpauschbetrages (1.000 €) zahlst du KET auf Gewinne – der Rechner berechnet das optional.",
      },
    ],
    useCases: [
      "Du willst endlich mit ETF-Sparen anfangen und sehen, wie viel dabei herauskommt.",
      "Bevor du Ausbildung oder Studium anfaengst, willst du einen ETF-Sparplan fuer eine Rückenlage aufbauen.",
      "Du planst Altersvorsorge und brauchst realistische Zahlen fuer 40+ Jahre.",
      "Du erhaeltst ein Erbe oder Bonus und willst berechnen, wie viel es bis zur Rente wert sein koennte.",
      "Dein Freund hat einen Sparplan – du willst nachrechnen, ob sich das fuer dich lohnt.",
    ],
    faqs: [
      {
        question: "Was ist Teilfreistellung?",
        answer: "Bei Aktienfonds (mind. 51% Aktien) sind 30% deiner Gewinne steuerfrei – das ist das Gesetz. Das bedeutet: du zahlst nur auf 70% der Gewinne Steuern. Das spart dir echtes Geld.",
      },
      {
        question: "Was ist der Sparerpauschbetrag?",
        answer: "2025 kannst du 1.000 € Kapitalertraege steuerfrei einstreichen (Ehepaar: 2.000 €). Das heisst: wenn dein ETF 800 € Gewinn macht, zahlst du darauf 0 € Steuern.",
      },
      {
        question: "Welche Rendite ist realistisch?",
        answer: "Bei Weltmarkt-ETFs (MSCI World) sind 7% p.a. ueber 15+ Jahre historisch realistisch. Kurzfristig kann es stark schwanken, aber langfristig glaettet sich das aus. Konservativ: 5-6%.",
      },
      {
        question: "Wann sollte ich anfangen zu sparen?",
        answer: "Je fruher, desto besser – auch mit kleinen Betraegen. Wenn du mit 20 bei 7% Rendite 50 € monatlich sparst, hast du mit 50 Jahren ueber 100.000 € angehaeufelt. Starten lohnt sich immer.",
      },
      {
        question: "Brauche ich ein Depot bei der Bank?",
        answer: "Ja, zum Sparen in ETF brauchst du ein Wertpapierdepot. Das eroeffnest du bei deiner Bank oder bei Online-Brokern wie Trade Republic, Scalable Capital, etc. Das ist kostenlos.",
      },
    ],
  },
  {
    slug: "zinsrechner",
    title: "Zinsrechner",
    metaTitle: "Zinsrechner 2025 – Zinsen & Zinseszins berechnen | BeAFox",
    metaDescription:
      "Berechne Zinsen und Zinseszins fuer Einmalanlagen – mit Zinsintervall, Laufzeit in Monaten und optionaler Steuerberechnung.",
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
    tips: [
      "Zinseszins ist der staerkste Verbuendete beim Vermoegensaufbau – dein Geld verdient Geld.",
      "Der Unterschied zwischen jaehrlicher und monatlicher Verzinsung wird bei langen Laufzeiten deutlich.",
      "Effektivzins zeigt die tatsaechliche Rendite inklusive Zinseszins-Effekt.",
      "Der Sparerpauschbetrag (1.000 € Einzel / 2.000 € Ehepaar) macht Zinsertraege bis dahin steuerfrei.",
      "Bei Schulden wirkt Zinseszins gegen dich – tilge hochverzinste Kredite zuerst.",
    ],
    intro: [
      "10.000 € bei 3% Zins ueber 10 Jahre ergeben nicht 13.000 €, sondern 13.439 €. Das ist Zinseszins – die 8. Wundertat der Welt, wie Einstein sagte. Deine Zinsen verdienen selbst wieder Zinsen.",
      "Mit diesem Zinsrechner siehst du die genaue Entwicklung deiner Geldanlage. Gib dein Kapital, den Zinssatz, die Laufzeit und das Zinsintervall ein – und beobachte, wie dein Geld waechst.",
    ],
    howItWorks: [
      {
        title: "Kapital eingeben",
        description: "Das ist deine Einmalanlage – z.B. 10.000 € auf ein Festgeldkonto oder Tagesgeldkonto.",
      },
      {
        title: "Zinssatz eintragen",
        description: "Der Jahreszinssatz ist die Rendite – z.B. 2,5% bei Tagesgeld oder 3,5% bei Festgeld. Check immer die Bank mit den besten Konditionen.",
      },
      {
        title: "Laufzeit in Monaten einstellen",
        description: "Wie lange laeuft die Anlage? 12 Monate, 24 Monate, 60 Monate – je laenger, desto mehr Zinseszins profitierst du.",
      },
      {
        title: "Zinsintervall waehlen",
        description: "Monatliche oder jaehrliche Verzinsung? Monatliche ist besser fuer dich – deine Zinsen werden schneller wieder verzinst.",
      },
      {
        title: "Steuern kalkulieren",
        description: "Kapitalertragsteuer (26,375%) faellt auf Gewinne an – aber nur ueber deinem Sparerpauschbetrag (1.000 €). Der Rechner zeigt dir Brutto und Netto.",
      },
    ],
    useCases: [
      "Du hast 5.000 € und willst Tagesgeld vergleichen – welche Bank bringt dich zum besten Ergebnis?",
      "Du ueberlegst, ein Festgeldkonto fuer 12 oder 24 Monate zu eroeffnen – wie viel bringt das?",
      "Du willst verstehen, wie Nominalzins und Effektivzins sich unterscheiden.",
      "Du sparst fuer einen Motorrad-Fuehrerschein in 18 Monaten und willst die Zinsen einrechnen.",
      "Du hast eine Erbschaft und moechtest berechnen, wie viel das auf Tagesgeld bringt.",
    ],
    faqs: [
      {
        question: "Was ist der Unterschied zwischen Nominal- und Effektivzins?",
        answer: "Nominalzins ist der Basiszinssatz, den die Bank angibt (z.B. 3%). Effektivzins (auch APR) beruecksichtigt Zinseszins und alle zusaetzlichen Kosten. Der Effektivzins ist die wahre Rendite.",
      },
      {
        question: "Wie stark ist der Zinseszins-Effekt wirklich?",
        answer: "Dramatisch! 10.000 € bei 3% Zins ueber 10 Jahre: ohne Zinseszins = 13.000 €, mit Zinseszins = 13.439 €. Je laenger, desto deutlicher wird der Unterschied.",
      },
      {
        question: "Muss ich Steuern auf Zinsen zahlen?",
        answer: "Ja, ab ca. 550 € Gewinn im Jahr (ueber deinem Sparerpauschbetrag von 1.000 €). Dann zahlst du 26,375% Kapitalertragsteuer. Unter 1.000 € Gewinn: 0 € Steuern.",
      },
      {
        question: "Welches Zinsintervall waehle ich?",
        answer: "Monatliche Verzinsung ist besser als jaehrlich – deine Zinsen werden schneller wieder verzinst. Der Unterschied wird bei langen Laufzeiten deutlich.",
      },
      {
        question: "Wie finde ich die besten Zinsen?",
        answer: "Vergleiche Tagesgeld und Festgeld auf Portalen wie Finanzfluss oder Finanztest. 2025 gibt es noch 2-3,5% bei guten Banken. Die beste Anlage ist nur wenige Klicks entfernt.",
      },
    ],
  },
  {
    slug: "budget-rechner",
    title: "Budget-Rechner (50-30-20)",
    metaTitle: "Budget-Rechner nach 50-30-20 Best Practice | BeAFox",
    metaDescription:
      "Plane dein monatliches Budget nach dem 50-30-20 Best-Practice-Prinzip: Fixkosten, Lifestyle und Sparen – mit Bewertung und Empfehlung.",
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
    tips: [
      "Die 50-30-20 Regel ist ein bewaehrtes Best-Practice-Prinzip: 50% Grundbedarf, 30% Wuensche, 20% Sparen.",
      "Miete sollte idealerweise nicht mehr als 30% deines Nettoeinkommens betragen.",
      "Versicherungen pruefen: Haftpflicht ist Pflicht, BU-Versicherung sehr empfehlenswert.",
      "Urlaub monatlich zuruecklegen: 80 €/Monat = fast 1.000 € Urlaubsbudget pro Jahr.",
      "Abos regelmaessig checken – viele zahlen fuer Dienste, die sie kaum nutzen.",
      "Auch 50 € monatlich in einen ETF-Sparplan investiert machen langfristig einen Unterschied.",
    ],
    intro: [
      "Die meisten jungen Menschen geben ueber 40% ihres Nettoeinkommens fuer Miete aus – zu viel. Die 50-30-20 Regel besagt: max. 50% fuer Fixkosten (Miete, Lebensmittel, Versicherungen), 30% fuer Lifestyle (Freizeit, Restaurant), 20% fuer Sparen.",
      "Mit diesem Budget-Rechner planst du deinen Monat. Gib dein Nettoeinkommen ein, trag deine Fixkosten und Lifestyle-Ausgaben ein – der Rechner zeigt dir, ob dein Budget aufgeht und wie viel du sparst.",
    ],
    howItWorks: [
      {
        title: "Netto-Einkommen eingeben",
        description: "Das ist dein monatliches Netto nach Steuern und Abgaben – die Summe, die auf dein Konto kommt.",
      },
      {
        title: "Fixkosten eintragen",
        description: "Miete, Nebenkosten, Versicherungen, Lebensmittel, Mobilitaet – alles, was du monatlich zahlen musst. Diese sollten max. 50% sein.",
      },
      {
        title: "Lifestyle-Ausgaben addieren",
        description: "Restaurant, Kino, Fitness, Hobby, Shopping – die Dinge, die dir Spass machen. Ideal: 30% deines Nettos. Wichtig fuer Work-Life-Balance!",
      },
      {
        title: "Ergebnis pruefen",
        description: "Der Rechner zeigt dir die Aufteilung und gibt Feedback: passt alles ins Budget? Sparst du genug?",
      },
      {
        title: "Optimieren und anpassen",
        description: "Zu viel Fixkosten? Vielleicht billigere Wohnung? Zu viel Lifestyle? Abos checken? Der Rechner hilft dir, Potenziale zu sehen.",
      },
    ],
    useCases: [
      "Du bekommst deine erste eigene Wohnung und brauchst einen realistischen Budgetplan.",
      "Du merkst, dass du am Ende des Monats pleite bist – Zeit fuer einen Budget-Check!",
      "Du willst herausfinden, wie viel du realistische sparen kannst – mit diesem Rechner siehst du es.",
      "Du planst einen Umzug und willst berechnen, wie viel Miete dein Budget vertraegt.",
      "Du verdienst mehr und wunderst dich, wohin das Geld geht – Transparenz schafft der Budgetrechner.",
    ],
    faqs: [
      {
        question: "Was ist die 50-30-20 Regel?",
        answer: "Eine bewiesene Formel: 50% deines Nettos fuer Grundbedarf (Miete, Essen, Versicherung), 30% fuer Lifestyle (Freizeit, Spass), 20% fuer Sparen. Das ist die ideale Balance zwischen Leben und Vorsorge.",
      },
      {
        question: "Meine Fixkosten sind ueber 50% – was kann ich tun?",
        answer: "Das ist ein echtes Problem, besonders in teuren Staedten. Optionen: billigere Wohnung, WG statt allein, Nebenkosten senken (Strom sparen, Anbieter wechseln), Versicherungen pruefen. Auch 100 € sparst du schnell.",
      },
      {
        question: "Wie viel sollte ich als Student sparen?",
        answer: "Die 50-30-20 Regel ist auch fuer Studis das Ideal. Realitaet: oft reicht es nur fuer 10-15% sparen, wenn du BAfoeg oder wenig verdienst. Hauptsache, du fangst an – auch 30 € im Monat ist besser als 0 €.",
      },
      {
        question: "Darf die Miete wirklich nicht ueber 30% sein?",
        answer: "Das ist die Faustregel. Aber: In Grossstaedten (Muenchen, Berlin, Hamburg) sind 35-40% realistisch. Wenn du uber 40% ausgibst, sparst du zu wenig – suche nach Moeglichkeiten zum Sparen.",
      },
      {
        question: "Was zaehlt alles zu den Fixkosten?",
        answer: "Miete (kalt + warm), Lebensmittel, Versicherungen (Haftpflicht, Hausrat), Telefon/Internet, Mobilitaet (Bahncard, Auto), Schulden/Raten. Lifestyle-Ausgaben wie Restaurant oder Kino gehoeren nicht dazu.",
      },
    ],
  },
  {
    slug: "mietkosten-rechner",
    title: "Mietkosten-Rechner",
    metaTitle: "Mietkosten-Rechner 2025 – Passt die Wohnung ins Budget? | BeAFox",
    metaDescription:
      "Pruefe ob deine Wohnung ins Budget passt: mit Warmmiete, Strom, Internet, GEZ, Versicherung, Preis/m² und personalisierter Empfehlung nach Stadtgroesse.",
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
    tips: [
      "Faustregel: Warmmiete + Nebenkosten sollten je nach Stadt 25-35% deines Nettoeinkommens nicht ueberschreiten.",
      "In Grossstaedten (Berlin, Muenchen, Hamburg) ist bis zu 35% realistisch – dafuer an anderen Stellen sparen.",
      "WG-Tipp: GEZ (18,36 €) und Internet koennt ihr euch teilen – spart schnell 20-30 € pro Person.",
      "Nebenkosten-Abrechnung immer pruefen: Nachzahlungen koennen ueberraschend hoch ausfallen.",
      "Kaution: Vermieter duerfen max. 3 Kaltmieten verlangen – als Ruecklage einplanen.",
      "Strom: Anbieter vergleichen lohnt sich! Wechsel spart oft 100-200 € im Jahr.",
    ],
    intro: [
      "Miete ist der groesste Posten im Budget – in Muenchen zahlen junge Menschen durchschnittlich ueber 800 € warm monatlich. Das ist oft 40-50% des Nettoeinkommens. Aber: nicht nur die Miete zaehlt, sondern auch Nebenkosten, Strom, Internet, GEZ und Versicherung.",
      "Mit diesem Mietkosten-Rechner siehst du, ob eine Wohnung wirklich in dein Budget passt. Gib dein Nettoeinkommen ein, waehle deine Wohnform (allein, WG, zuhause) und trag alle Kosten ein – der Rechner zeigt dir, ob es passt.",
    ],
    howItWorks: [
      {
        title: "Netto-Einkommen eingeben",
        description: "Das ist die Basis – dein monatliches Netto nach Steuern und Abgaben. Nur von diesem Betrag kannst du realistisch rechnen.",
      },
      {
        title: "Wohnform waehlen",
        description: "Allein, WG, noch zuhause? Je nach Wohnform unterscheiden sich Kosten dramatisch. Eine WG kann bis zu 50% der Mietkosten sparen.",
      },
      {
        title: "Alle Kosten eintragen",
        description: "Nicht nur Miete! Nebenkosten, Strom, Internet, GEZ, Versicherung – jeder Posten zaehlt. Das ist die Warmmiete im echten Leben.",
      },
      {
        title: "Stadtgroesse auswaehlen",
        description: "Muenchen? Berlin? Kleinstadt? Das beeinflusst realistische Vergleichswerte. Der Rechner zeigt, wie deine Kosten im Vergleich stehen.",
      },
      {
        title: "Bewertung lesen und Tipps nutzen",
        description: "Der Rechner gibt dir Feedback: Ist die Wohnung ueberteuert? Brauchst du eine billigere? Solltest du eine WG suchen?",
      },
    ],
    useCases: [
      "Du suchst deine erste Wohnung und weisst nicht, wie viel Miete dein Budget vertraegt.",
      "Du vergleichst: WG vs. allein – welche Option ist guenstiger und macht mehr Sinn fuer dein Budget?",
      "Du ueberlegt, von zuhause auszuziehen – wie hoch faellt der Kostensprung aus?",
      "Du planst einen Umzug und willst vorher durchkalkulieren, ob du dir die neue Stadt/Wohnung leisten kannst.",
      "Du erhaeltst ein Jobangebot in einer anderen Stadt – nutze den Rechner, um zu sehen, wie es finanziell aussieht.",
    ],
    faqs: [
      {
        question: "Wie viel Miete bei welchem Gehalt?",
        answer: "Faustregel: max. 30% deines Nettos fuer Miete (kalt). Bei 1.500 € Netto also ca. 450 €. Mit Nebenkosten/Strom/Internet bist du schnell bei 25-35% des Nettos. In Grossstaedten bis 40% realistisch.",
      },
      {
        question: "Was kostet eine Kaution und wie laeuft sie ab?",
        answer: "Vermieter duerfen max. 3 Monatskaltmieten als Kaution verlangen. Diese gibt es nach Umzug zurück – aber erst nach Nebenkostenabrechnung und Mängelprüfung (3-6 Monate). Einplanen!",
      },
      {
        question: "Wie hoch fallen Nebenkosten typisch aus?",
        answer: "Durchschnitt 200-300 € monatlich (Wasser, Heizung, Abfall, Hausmeister). Im Winter mehr (Heizung!), im Sommer weniger. Immer im Mietvertrag nachfragen und Nebenkosten-Abrechnungen pruefen.",
      },
      {
        question: "Wie funktioniert GEZ in einer WG?",
        answer: "Pro Wohnung 18,36 € (2025), nicht pro Person. In einer WG teilt ihr euch das – also z.B. in 3er WG nur 6 € pro Person. Das ist ein grosser Vorteil der WG!",
      },
      {
        question: "Wie sparen wir Kosten in der WG?",
        answer: "GEZ teilen (spart 12 € pro Person), Internet teilen (spart 20 €), grossere Einkaufsmengen, gemeinsam kochen. In einer 3er WG spart jeder 50-100 € monatlich vs. allein wohnen. Aber: weniger Privatsphäre.",
      },
    ],
  },
  {
    slug: "taschengeld-rechner",
    title: "Taschengeld-Rechner",
    metaTitle: "Taschengeld Rechner 2025 – Empfehlung nach Alter | BeAFox",
    metaDescription:
      "Wie viel Taschengeld ist fair? Vergleiche dein Taschengeld mit der DJI-Empfehlung, teile es smart auf und erreiche dein Sparziel.",
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
      { label: "Empfehlung (DJI-Taschengeldtabelle)", isSectionHeader: true, key: "_sec1" },
      { label: "DJI-Empfehlung: Minimum", key: "empf_min" },
      { label: "DJI-Empfehlung: Maximum", key: "empf_max" },
      { label: "Differenz zu Empfehlung (Mitte)", key: "diff_empf" },
      { label: "Bewertung", key: "bewertung_tg" },
      // ── Dein Gesamtbudget ──
      { label: "Dein Gesamtbudget", isSectionHeader: true, key: "_sec2" },
      { label: "Taschengeld + Nebenjob", key: "gesamtbudget", highlight: true },
      { label: "Davon Fixkosten gesamt", key: "fixkosten" },
      { label: "Fixkosten-Anteil", key: "fixkosten_pct" },
      { label: "Restbudget nach Fixkosten", key: "rest_nach_fix", highlight: true },
      { label: "Fixkosten-Check", key: "bewertung_fix" },
      // ── Empfohlene Aufteilung (50-30-20) ──
      { label: "Empfohlene Aufteilung (50-30-20)", isSectionHeader: true, key: "_sec3" },
      { label: "Bedarf (Handy, Fahrt, Schule) – 50%", key: "budget_bedarf" },
      { label: "Freizeit (Kino, Hobbys, Snacks) – 30%", key: "budget_freizeit" },
      { label: "Sparen (ETF, Sparziel) – 20%", key: "budget_sparen" },
      // ── Reale Aufteilung nach Fixkosten ──
      { label: "Reale Aufteilung (nach Fixkosten)", isSectionHeader: true, key: "_sec4" },
      { label: "Fuer Freizeit verfuegbar (60%)", key: "freizeit_real" },
      { label: "Zum Sparen moeglich (40%)", key: "sparen_real", highlight: true },
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
    tips: [
      "50-30-20 Regel: 50% Bedarf, 30% Freizeit, 20% Sparen – auch beim Taschengeld!",
      "Fuehre ein Haushaltsbuch oder nutze eine App – so siehst du, wohin dein Geld fliesst.",
      "Streaming-Tipp: Familien-Abo teilen spart bis zu 50%. Spotify Duo, Netflix Standard etc.",
      "Handy-Tipp: Prepaid oder guenstige Tarife (z.B. fraenk, Aldi Talk) ab 5-8 EUR/Monat.",
      "Deutschlandticket (58 EUR) lohnt sich ab 2-3 Fahrten pro Woche – rechne nach!",
      "Nebenjob ab 16: Supermarkt, Nachhilfe, Babysitten – oft 8-12 EUR/Stunde moeglich.",
      "Spar-Challenge: Jede Woche 1 EUR mehr sparen (Woche 1: 1 EUR, Woche 2: 2 EUR, …) = 1.378 EUR/Jahr!",
      "Ab 18: Eigenes Girokonto + ETF-Sparplan eroeffnen – auch kleine Betraege lohnen sich langfristig!",
      "Kaufe gebraucht (Vinted, eBay Kleinanzeigen) statt neu – spart oft 50-70% bei Kleidung und Technik.",
      "Wunschliste statt Impulskauf: 48h warten bevor du etwas kaufst – 70% der Kaeufe fallen weg!",
    ],
    intro: [
      "Taschengeld ist deine erste finanzielle Lektion. Die Taschengeldtabelle der Deutschen Jugendinstituts (DJI) zeigt, wie viel Geld in deinem Alter fair ist – und wie du es klug aufteilst zwischen Fixkosten, Freizeit und Sparen.",
      "Egal ob du 12 oder 18 bist, mit dem Taschengeld-Rechner erkennst du schnell, ob dein Budget realistisch ist und wie viel überhaupt zum Sparen bleibt.",
    ],
    howItWorks: [
      { title: "Alter & Status eingeben", description: "Gib dein Alter und deinen Status ein (Schüler, Azubi, Student, Berufstätig). Das bestimmt die DJI-Empfehlung und deine durchschnittlichen Ausgaben." },
      { title: "Fixkosten hinzufügen", description: "Trage deine regelmäßigen Ausgaben ein: Handy, Streaming, Fahrtkosten, Schulmaterial. Der Rechner zeigt automatisch, wie viel Prozent deines Budgets hierfür weggeht." },
      { title: "Sparziel definieren", description: "Setze dir ein konkretes Ziel (Konsole, Führerschein, Reise) und entscheide, wie lange du sparen möchtest. Der Rechner berechnet, wie viel du monatlich beiseitelegen musst." },
      { title: "50-30-20-Regel anwenden", description: "Der Rechner zeigt dir die ideale Aufteilung: 50% für Bedarf, 30% für Freizeit, 20% zum Sparen. So behältst du die Balance zwischen Genuss und Vermögensaufbau." },
      { title: "Empfehlung & Tipps lesen", description: "Lade dein Ergebnis herunter oder teile es mit deinen Eltern. Der Rechner gibt dir konkrete Nebenjob- und Spar-Ideen für dein Alter." },
    ],
    useCases: [
      "Taschengeld mit Eltern verhandeln – mit der DJI-Empfehlung hast du ein starkes Argument",
      "Wöchentliches Budget planen als Teenager – damit das Geld vom Montag bis Freitag reicht",
      "Sparziel konkretisieren: Wie viel muss ich monatlich beiseitelegen für eine neue Konsole?",
      "Nebenjob Check: Lohnt sich der Supermarktjob neben der Schule?",
      "Streaming-Abo überprüfen: Passt Netflix noch in mein Budget oder sollte ich es teilen?",
      "Führerschein-Planung: Wie viel muss ich jeden Monat sparen, um den Führerschein mit 18 zu machen?",
      "Budgetgeld vs. Taschengeld verstehen: Was ist der Unterschied und was passt zu mir?",
    ],
    faqs: [
      {
        question: "Wie viel Taschengeld ist normal für mein Alter?",
        answer: "Die DJI-Empfehlung 2025 liegt zwischen 10-12 EUR/Woche mit 10 Jahren und 75-100 EUR/Woche mit 18+ Jahren. Der Rechner zeigt die exakte Spanne für dein Alter.",
      },
      {
        question: "Ab wann sollte ich Taschengeld bekommen?",
        answer: "Experten empfehlen ab 6-7 Jahren mit kleinen Beträgen zu starten (1-2 EUR/Woche). So lernst du früh, Geld einzuteilen. Mit 10 Jahren kann es regelmäßiger werden.",
      },
      {
        question: "Was ist der Unterschied zwischen Taschengeld und Budgetgeld?",
        answer: "Taschengeld ist zur freien Verfügung – du entscheidest komplett. Budgetgeld ist für deine Ausgaben reserviert (Handy, Klamotten) und du verwaltest es selbst. Viele nutzen eine Mischung.",
      },
      {
        question: "Wie teile ich mein Taschengeld sinnvoll auf?",
        answer: "Die 50-30-20-Regel ist ein guter Start: 50% für Notwendiges (Handy, Fahrt), 30% für Freizeit (Kino, Snacks), 20% zum Sparen. Der Rechner zeigt deine persönliche Aufteilung.",
      },
      {
        question: "Sollte ich für Hausarbeit Taschengeld bekommen?",
        answer: "Experten sagen: Ja, Taschengeld ist bedingungslos (gehört zur Familie). Zusätzlich kannst du für Besonderes (Rasenmähen, Fensterputzen) etwas verdienen – das ist dann ein Mini-Job.",
      },
    ],
  },
  {
    slug: "notgroschen-rechner",
    title: "Notgroschen-Rechner",
    metaTitle: "Notgroschen Rechner 2025 – Wie viel Ruecklagen brauchst du? | BeAFox",
    metaDescription:
      "Berechne deinen idealen Notgroschen: personalisiert nach Einkommen, Fixkosten, Lebenssituation und Risikofaktoren. Mit Aufbauplan und Tagesgeld-Tipp.",
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
      { label: "Deine monatlichen Fixkosten", isSectionHeader: true, key: "_sec1" },
      { label: "Fixkosten gesamt", key: "fixkosten" },
      { label: "Fixkosten-Quote (vom Netto)", key: "fixkosten_quote" },
      // ── Empfehlung ──
      { label: "Notgroschen-Empfehlung", isSectionHeader: true, key: "_sec2" },
      { label: "Dein Status", key: "status_text" },
      { label: "Empfohlene Monate (Min.)", key: "empf_monate_min" },
      { label: "Empfohlene Monate (Max.)", key: "empf_monate_max" },
      { label: "Zuschlag Auto (Reparatur-Puffer)", key: "zuschlag_auto" },
      { label: "Zuschlag Haustier (Tierarzt-Puffer)", key: "zuschlag_haustier" },
      { label: "Notgroschen Minimum", key: "notgroschen_min" },
      { label: "Notgroschen Maximum", key: "notgroschen_max" },
      { label: "Notgroschen Empfehlung (Mitte)", key: "notgroschen_empf", highlight: true },
      // ── Dein Status ──
      { label: "Dein aktueller Stand", isSectionHeader: true, key: "_sec3" },
      { label: "Bereits vorhanden", key: "vorhanden" },
      { label: "Fortschritt", key: "fortschritt_pct" },
      { label: "Differenz zum Ziel", key: "differenz" },
      { label: "Bewertung", key: "bewertung" },
      // ── Aufbauplan ──
      { label: "Aufbauplan", isSectionHeader: true, key: "_sec4" },
      { label: "Fehlbetrag", key: "fehlbetrag" },
      { label: "Monate bis Ziel (bei deiner Sparrate)", key: "monate_aufbau", highlight: true },
      { label: "Noetige Sparrate fuer 6 Monate", key: "sparrate6m" },
      { label: "Noetige Sparrate fuer 12 Monate", key: "sparrate12m" },
      { label: "Noetige Sparrate fuer 24 Monate", key: "sparrate24m" },
      { label: "Deine Sparquote", key: "sparquote" },
      // ── Tagesgeld-Tipp ──
      { label: "Wo anlegen?", isSectionHeader: true, key: "_sec5" },
      { label: "Tagesgeld-Zinsen pro Jahr (ca. 3%)", key: "tagesgeld_ertrag" },
      { label: "Empfehlung", key: "tagesgeld_tipp" },
    ],
    tips: [
      "Goldene Regel: 3-6 Netto-Monatsausgaben als Notgroschen – Selbststaendige besser 6-12 Monate.",
      "Notgroschen gehoert aufs Tagesgeldkonto – jederzeit verfuegbar, nicht auf dem Girokonto 'vergessen'.",
      "Automatischer Dauerauftrag am Gehaltstag einrichten: 'Pay yourself first' – Sparen bevor du ausgibst.",
      "Auto-Besitzer: Rechne mit 1.000-2.000 EUR extra Puffer fuer unerwartete Reparaturen (Bremsen, TUeV, Reifen).",
      "Haustier: Eine Tierarzt-Rechnung kann schnell 500-1.000 EUR kosten – extra Puffer einplanen oder Tier-OP-Versicherung pruefen.",
      "Tagesgeld-Vergleich lohnt sich: 3% auf 5.000 EUR = 150 EUR Zinsen/Jahr geschenkt!",
      "Starter-Tipp: Starte mit 1.000 EUR als Sofort-Ziel – das deckt die haeufigsten Notfaelle ab.",
      "Nicht anfassen! Der Notgroschen ist NUR fuer echte Notfaelle (Jobverlust, Autoreparatur, Krankheit) – nicht fuer Urlaub oder Sales.",
      "Notgroschen voll? Dann jeden weiteren Euro in ETF-Sparplan stecken – langfristig deutlich mehr Rendite als Tagesgeld.",
      "3-Konten-Modell: Girokonto (Alltag) + Tagesgeld (Notgroschen) + Depot (Vermoegenaufbau) – so behaehlst du den Ueberblick.",
    ],
    intro: [
      "40% der Deutschen haben keine 1.000 EUR für Notfälle auf dem Konto – keine gute Situation. Ein Notgroschen ist dein finanzielles Airbag für unerwartete Ausgaben: Autoreparatur, Jobverlust, Zahnarzt.",
      "Mit diesem Rechner erfährst du, wie viel Notgroschen zu deiner Situation passt und wie lange es dauert, ihn aufzubauen – mit einer realistischen Sparrate.",
    ],
    howItWorks: [
      { title: "Einkommen eingeben", description: "Gib dein monatliches Nettoeinkommen ein und wähle deinen Status (Angestellt, Selbstständig, Student, Azubi). Das bestimmt, wie viel Monate als Sicherheitspuffer sinnvoll sind." },
      { title: "Fixkosten aufschlüsseln", description: "Trage Miete, Nebenkosten, Versicherungen, Auto, Haustier ein. Der Rechner zeigt, wie viel Prozent deines Einkommens für feste Ausgaben weggeht." },
      { title: "Vorhandenes eintragen", description: "Wie viel hast du bereits auf die Seite gelegt? Der Rechner zeigt deinen aktuellen Fortschritt zum Ziel." },
      { title: "Sparrate festlegen", description: "Wie viel möchtest du monatlich sparen? Der Rechner berechnet, wie lange du brauchst, bis dein Notgroschen voll ist." },
      { title: "Aufbauplan lesen & umsetzen", description: "Der Rechner zeigt dir konkrete Meilensteine (1.000 EUR, 3 Monate Fixkosten, etc.) und Zinsgewinne beim Tagesgeld." },
    ],
    useCases: [
      "Notgroschen-Ziel berechnen nach Jobstart oder Lehrausbildung",
      "Aufbauplan erstellen: Wie viel EUR/Monat muss ich sparen, um in 12 Monaten fertig zu sein?",
      "Sparrate optimieren: Kann ich mit 150 EUR/Monat auskommen oder brauche ich 250 EUR?",
      "Tagesgeld-Strategie planen: Wo lagere ich den Notgroschen an, damit er Zinsen bringt?",
      "Auto- oder Haustier-Puffer berechnen: Was kostet ein großer Reparaturfall wirklich?",
      "Selbstständig werden: Wie viel Notgroschen brauche ich, bevor ich einen Job kündige?",
      "Jobverlust vorbeugen: Reichen meine 5.000 EUR oder brauche ich 10.000 EUR?",
    ],
    faqs: [
      {
        question: "Wie viel Notgroschen ist genug?",
        answer: "Faustregel: 3-6 Netto-Monatsausgaben. Bei 2.000 EUR Fixkosten also 6.000-12.000 EUR. Selbstständige sollten 6-12 Monate einplanen, Angestellte 3-6 Monate.",
      },
      {
        question: "Wo soll ich meinen Notgroschen anlegen?",
        answer: "Tagesgeld ist ideal: Jederzeit verfügbar, sichere Anlage, 3%+ Zinsen (2025). Nicht auf dem Girokonto – da vergisst du leicht, dass das Geld reserviert ist.",
      },
      {
        question: "Notgroschen vs. Investieren – was kommt zuerst?",
        answer: "Der Notgroschen zuerst! Erst 3-6 Monate Fixkosten auf dem Tagesgeld, dann kannst du Überschüsse in ETF-Sparpläne investieren.",
      },
      {
        question: "Wie schnell sollte ich meinen Notgroschen aufbauen?",
        answer: "Mit 200-300 EUR/Monat dauert es bei 6.000 EUR etwa 20-30 Monate. Wenn möglich: schneller aufbauen (500 EUR/Monat), dann in 12-15 Monaten fertig.",
      },
      {
        question: "Zählt mein Ersparte als Notgroschen?",
        answer: "Nur, wenn es wirklich unberührt bleibt! Ein echtes Notgroschen-Konto (separates Tagesgeld) macht es leichter, nicht in Versuchung zu geraten.",
      },
    ],
  },
  {
    slug: "nebenjob-steuer-rechner",
    title: "Nebenjob- & Minijob-Rechner",
    metaTitle: "Minijob & Nebenjob Rechner 2025 – Netto, Abgaben, Steuern | BeAFox",
    metaDescription:
      "Berechne dein Netto aus Minijob, Midijob oder Werkstudentenjob: alle Abgaben fuer Arbeitnehmer und Arbeitgeber auf einen Blick (2025).",
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
      { label: "Deine Abzuege (Arbeitnehmer)", isSectionHeader: true, key: "_sec2" },
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
      { label: "Kosten fuer den Arbeitgeber", isSectionHeader: true, key: "_sec4" },
      { label: "AG: Krankenversicherung", key: "ag_kv" },
      { label: "AG: Rentenversicherung", key: "ag_rv" },
      { label: "AG: Pauschsteuer", key: "ag_steuer" },
      { label: "AG: Umlage U1 (Krankheit)", key: "ag_u1" },
      { label: "AG: Umlage U2 (Mutterschaft)", key: "ag_u2" },
      { label: "AG: Insolvenzgeldumlage", key: "ag_insolvenz" },
      { label: "AG Abgaben gesamt", key: "ag_gesamt" },
      { label: "AG Gesamtkosten (Brutto + Abgaben)", key: "ag_total_kosten", highlight: true },
      // ── Bewertung & Tipps ──
      { label: "Bewertung & Hinweise", isSectionHeader: true, key: "_sec5" },
      { label: "Max. Stunden fuer Minijob (bei deinem Lohn)", key: "max_stunden_minijob" },
      { label: "Bewertung", key: "bewertung" },
      { label: "Steuer-Hinweis", key: "steuer_hinweis" },
    ],
    tips: [
      "Minijob-Grenze 2025: bis 556 EUR/Monat (6.672 EUR/Jahr) – fuer dich komplett steuerfrei!",
      "Mindestlohn 2025: 12,82 EUR/Stunde – dein Arbeitgeber darf nicht weniger zahlen.",
      "RV-Befreiung: Standard beim Minijob. Ohne Befreiung zahlst du 3,6% selbst, sammelst aber Rentenpunkte.",
      "Midijob (556-2.000 EUR): Reduzierte SV-Beitraege in der Gleitzone – oft lohnender als knapp unter 556 EUR zu bleiben.",
      "Werkstudent: Max. 20h/Woche in der Vorlesungszeit. Nur RV-Pflicht (9,3%) – keine KV, PV oder ALV!",
      "Zwei Minijobs? Geht, solange die Summe unter 556 EUR bleibt. Beim 2. Minijob neben Hauptjob: volle SV-Pflicht!",
      "Steuererklaerung lohnt sich: Auch als Minijobber kannst du Werbungskosten (Fahrt, Arbeitskleidung) absetzen.",
      "BAföG + Minijob: Bis 556 EUR/Monat kein Einfluss auf BAföG. Darueber wird angerechnet!",
      "Kurzfristige Beschaeftigung: Alternative zum Minijob – max. 70 Tage/Jahr, keine Verdienstgrenze, abgabenfrei.",
      "Tipp fuer Schueler: Ab 15 Jahren darfst du in den Ferien bis zu 4 Wochen am Stueck Vollzeit arbeiten.",
    ],
    intro: [
      "Über 7 Millionen Menschen in Deutschland arbeiten als Minijobber. Ein Minijob (bis 556 EUR/Monat) ist steuerfrei, aber es gibt auch den Midijob (556-2.000 EUR) und die Werkstudent-Position mit jeweils anderen Regeln.",
      "Mit diesem Rechner siehst du sofort, wie viel Netto du verdienst, welche Abgaben dein Arbeitgeber zahlt und ob du besser bei 550 EUR bleibst oder in die Gleitzone des Midijobs ausweichst.",
    ],
    howItWorks: [
      { title: "Stundenlohn eingeben", description: "Gib deinen Bruttolohn ein (Mindestlohn 2025: 12,82 EUR). Der Rechner multipliziert das mit deinen Stunden pro Woche." },
      { title: "Jobtyp wählen", description: "Minijob (Gewerbe), Privathaushalt, oder Werkstudent? Jeder hat andere Abgaben und Freibeträge." },
      { title: "Stunden pro Woche festlegen", description: "Der Rechner zeigt, ab wann die 556-EUR-Grenze überschritten wird und wie die Gleitzone des Midijobs funktioniert." },
      { title: "Abgaben sehen", description: "Du siehst exakt: RV, KV, PV, ALV und Steuern – sowohl dein Anteil als auch was der Arbeitgeber zahlt." },
      { title: "Netto ablesen und vergleichen", description: "Dein echtes Take-Home pro Monat und Jahr. Vergleich: Lohnt sich eine Stunde mehr? Passt der Job neben BAföG?" },
    ],
    useCases: [
      "Minijob-Grenze 556 EUR beachten: Verdiene ich noch steuerfrei oder übersteige ich die Grenze?",
      "Werkstudent Vorteile prüfen: Nur Rentenversicherung, aber volle BAföG-Kompatibilität?",
      "Midijob-Gleitzone nutzen: Zwischen 556-2.000 EUR gibt es reduzierte Sozialversicherung – rechne nach!",
      "Zwei Minijobs kombinieren: Geht es, solange die Summe unter 556 EUR bleibt?",
      "BAföG + Nebenjob: Bis 556 EUR/Monat kein BAföG-Impact, danach wird es angerechnet.",
      "Steuererklärung-Lohnstoff: Kann ich als Minijobber überhaupt Werbungskosten absetzen?",
      "Schüler-Ferienjob: Verdiene ich in den 4 Sommerwochen mehr, bleibt es steuerfrei?",
    ],
    faqs: [
      {
        question: "Was ist die Minijob-Grenze 2025?",
        answer: "556 EUR pro Monat oder 6.672 EUR pro Jahr. Solange du darunter bleibst, zahlst du keine Einkommen-, Lohnsteuer oder Sozialversicherung – komplett steuerfrei!",
      },
      {
        question: "Werkstudent: Was sind die Vorteile?",
        answer: "Nur Rentenversicherung (9,3%), keine KV, PV oder ALV. Perfekt für BAföG-Studis. Aber: Max. 20h/Woche in der Vorlesungszeit, sonst kein Werkstudent-Status.",
      },
      {
        question: "Midijob-Gleitzone: Lohnt sich 700 EUR statt 556 EUR?",
        answer: "Oft ja! Die Gleitzone (556-2.000 EUR) hat reduzierte Beiträge. Ein 700-EUR-Midijob bringt netto oft mehr als unter 556 EUR zu bleiben, obwohl du SV-Beiträge zahlst.",
      },
      {
        question: "Kann ich zwei Minijobs gleichzeitig haben?",
        answer: "Ja, solange die Summe aller Minijobs unter 556 EUR bleibt. Beim 2. Minijob neben deinem Hauptjob musst du aufpassen: Das kann zu voller SV-Pflicht führen!",
      },
      {
        question: "Abgaben als Schüler oder Student – gibt es Vergünstigungen?",
        answer: "Der Mindestlohn von 12,82 EUR gilt auch für dich! Rabatte gibt es nicht. Dafür: Werkstudent-Status gibt dir massive Einsparungen bei den Abgaben.",
      },
    ],
  },
  {
    slug: "bafog-rechner",
    title: "BAföG-Rechner",
    metaTitle: "BAföG Rechner 2025 – Anspruch & Hoehe berechnen | BeAFox",
    metaDescription:
      "Berechne deinen BAföG-Anspruch: personalisiert nach Wohnsituation, Elterneinkommen, eigenem Verdienst und Vermoegen. Mit Zuschuss/Darlehen-Aufschluesselung.",
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
      { label: "Gesamtbedarf (max. BAfoeg)", key: "gesamt_bedarf", highlight: true },
      // ── Elterneinkommen ──
      { label: "Anrechnung Elterneinkommen", isSectionHeader: true, key: "_sec2" },
      { label: "Eltern: bereinigtes Netto (monatlich)", key: "eltern_netto_monat" },
      { label: "Eltern: Freibetrag", key: "eltern_freibetrag" },
      { label: "Eltern: Ueberhang", key: "eltern_ueberhang" },
      { label: "Anrechnungssatz", key: "anrechnungs_satz" },
      { label: "Anrechnung Eltern (auf dich)", key: "eltern_anrechnung" },
      // ── Weitere Anrechnungen ──
      { label: "Weitere Anrechnungen", isSectionHeader: true, key: "_sec3" },
      { label: "Anrechnung eigenes Einkommen", key: "eigen_anrechnung" },
      { label: "Anrechnung Vermoegen (monatlich)", key: "vermoegen_anrechnung" },
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
    tips: [
      "BAfoeg ist halb geschenkt! 50% Zuschuss + 50% zinsloses Darlehen – Rueckzahlung erst 5 Jahre nach Studienende.",
      "Rueckzahlung gedeckelt auf max. 10.010 EUR – egal wie viel du insgesamt bekommen hast.",
      "Minijob bis 556 EUR/Monat ist BAfoeg-kompatibel – kein Abzug! Perfekte Ergaenzung.",
      "Vermoegen: 15.000 EUR Freibetrag. Tipp: Depot & Tagesgeld VOR dem Antrag pruefen.",
      "Immer Antrag stellen! Selbst bei Teilfoerderung lohnt sich BAfoeg (zinsloses Darlehen).",
      "Frist beachten: BAfoeg wird NICHT rueckwirkend gezahlt – ab dem Monat der Antragstellung.",
      "Eltern getrennt? Dann wird jeder Elternteil einzeln betrachtet – oft guenstiger!",
      "Geschwister in Ausbildung senken deine Anrechnung – unbedingt angeben.",
      "Auslands-BAfoeg: Hoehere Saetze moeglich (Studiengebuehren, Reisekosten). Anderes Amt zustaendig!",
      "Vorzeitige Rueckzahlung: Bis zu 50% Rabatt auf den Darlehenanteil bei Einmalzahlung.",
    ],
    intro: [
      "Der BAföG-Höchstsatz 2025 beträgt 992 EUR pro Monat für Studierende. BAföG ist eine Mischung aus Zuschuss (50%) und zinsloses Darlehen (50%) – du zahlst später zurück, aber zinslos.",
      "Dein BAföG-Anspruch hängt von deiner Wohnsituation, dem Einkommen deiner Eltern, deinen Geschwistern und deinem eigenen Verdienst ab. Mit diesem Rechner siehst du, wie viel dir realistisch zusteht.",
    ],
    howItWorks: [
      { title: "Wohnsituation wählen", description: "Wohnst du bei Eltern (Pauschalbudget: 280 EUR)? Im Wohnheim (340 EUR)? In der eigenen Wohnung (934 EUR)? Das bestimmt deinen Freibetrag stark." },
      { title: "Elterneinkommen eingeben", description: "Gib das Bruttoeinkommen deiner Eltern des Vorjahres ein. Das ist die Hauptbremse – über 2.000 EUR wird es knifflig." },
      { title: "Geschwister berücksichtigen", description: "Jedes Geschwister mit eigenem Einkommen or Studium reduziert den Elternfreibetrag. Der Rechner passt das automatisch an." },
      { title: "Eigenes Einkommen eintragen", description: "Ein Minijob (556 EUR), Nebenjob oder BaFöG-Freibetrag (290 EUR Monatsfreibetrag, 20 EUR Stundenlohn). Was ist erlaubt?" },
      { title: "BAföG-Anspruch ablesen", description: "Du siehst: Gesamtbetrag, wie viel Zuschuss vs. Darlehen, Rückzahlungsplan und Tipps für mehr BAföG." },
    ],
    useCases: [
      "BAföG-Antrag vorbereiten: Welche Unterlagen brauchst ich und wie ist meine Chancen?",
      "Eltern überzeugen: Mit welchem Einkommen gibt es weniger BAföG?",
      "Nebenjob-Freibetrag nutzen: Wann wird mein Minijob-Verdienst auf BAföG angerechnet?",
      "BAföG + Minijob kombinieren: Darf ich 556 EUR verdienen, ohne BAföG zu verlieren?",
      "Elternunabhängiges BAföG prüfen: Ab wann kriegst du BAföG, auch wenn deine Eltern reich sind?",
      "Stundenlohn optimieren: 20 EUR Stundenlohn-Freibetrag – wann greift der?",
      "Wohnung vs. Eltern: Rechnet sich Ausziehen zum Studium, wenn BAföG steigt?",
    ],
    faqs: [
      {
        question: "Wie hoch ist der BAföG-Höchstsatz 2025?",
        answer: "992 EUR pro Monat für Studierende, die auswärts wohnen. Davon sind 496 EUR Zuschuss, 496 EUR Darlehen (zinslos).",
      },
      {
        question: "Wie viel muss ich zurückzahlen?",
        answer: "Maximum ca. 10.010 EUR (das BAföG-Darlehen). Du zahlst zinslos ab deinem 6. Semester nach Studienende, monatlich mindestens 102 EUR.",
      },
      {
        question: "Was ist der Vermögensfreibetrag?",
        answer: "Du darfst 15.000 EUR sparen haben, ohne dass BAföG gestrichen wird. Zum 31.12. des Jahres, in dem du BAföG beantragst, wird geprüft.",
      },
      {
        question: "Wann bekommst du elternunabhängiges BAföG?",
        answer: "Mit 30 Jahren brauchst du auch mit reichen Eltern kein BAföG. Oder: 5 Jahre Berufstätigkeit + 3 Jahre Einkommen über 15.000 EUR/Jahr.",
      },
      {
        question: "BAföG mit Minijob – wie viel darf ich verdienen?",
        answer: "Bis 556 EUR/Monat kein Problem. Danach wird es auf BAföG angerechnet. Werkstudent-Job (20h/Woche) ist besser – nur RV-Abgaben, aber BAföG-neutral.",
      },
    ],
  },
  {
    slug: "stundenlohn-rechner",
    title: "Stundenlohnrechner",
    metaTitle: "Stundenlohn Rechner 2025 – Echten Stundenlohn berechnen | BeAFox",
    metaDescription:
      "Berechne deinen echten Stundenlohn: mit Urlaub, Feiertagen, Weihnachtsgeld und Sonderzahlungen. Vergleiche formalen und effektiven Stundenlohn.",
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
      { label: "Formaler Stundenlohn (Brutto)", key: "stundenlohn_formal", highlight: true },
      { label: "Effektiver Stundenlohn (mit Urlaub & Feiertagen)", key: "stundenlohn_effektiv" },
      { label: "Effektiver Stundenlohn (inkl. Sonderzahlungen)", key: "stundenlohn_mit_sonder", highlight: true },
      { label: "Sonderzahlungen pro Arbeitsstunde", key: "sonder_pro_stunde" },
      { label: "Mindestlohn-Check", key: "mindestlohn_check" },
      // ── Verdienst-Uebersicht ──
      { label: "Verdienst-Uebersicht", isSectionHeader: true, key: "_sec2" },
      { label: "Tagesverdienst", key: "tagesverdienst" },
      { label: "Wochenverdienst", key: "wochenverdienst" },
      { label: "Monatsgehalt", key: "monatsgehalt_out" },
      { label: "Jahresgehalt (ohne Sonderzahlungen)", key: "jahresgehalt_ohne" },
      { label: "Jahresgehalt (inkl. Sonderzahlungen)", key: "jahresgehalt_mit", highlight: true },
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
      { label: "Tatsaechliche Arbeitsstunden/Jahr", key: "arbeitsstunden_jahr" },
      { label: "Bezahlte Freistunden (Urlaub+Feiertage)", key: "freizeit_stunden" },
      // ── Bewertung ──
      { label: "Bewertung", isSectionHeader: true, key: "_sec4" },
      { label: "Fazit", key: "bewertung" },
    ],
    tips: [
      "Mindestlohn 2025: 12,82 EUR/Stunde – pruefe dein Gehalt, besonders als Azubi oder Werkstudent!",
      "Formaler vs. effektiver Stundenlohn: Der effektive ist IMMER hoeher, weil du fuer Urlaub & Feiertage bezahlt wirst, ohne zu arbeiten.",
      "Jobangebote vergleichen: Immer den effektiven Stundenlohn berechnen – 3.000€ bei 40h vs. 2.600€ bei 35h kann ueberraschen!",
      "Weihnachtsgeld: Ein volles 13. Gehalt erhoeht deinen effektiven Stundenlohn um ca. 8%.",
      "Bayern hat 13 Feiertage, Hamburg/Bremen nur 10 – das sind 3 bezahlte Urlaubstage Unterschied!",
      "Ueberstunden druecken den Stundenlohn! 5 unbezahlte Ueberstunden/Woche senken ihn um ~12%.",
      "Gehaltsverhandlung: 100€ mehr Monatsgehalt = ca. 0,58€ mehr Stundenlohn bei 40h-Woche.",
      "Teilzeit pruefen: Weniger Stunden bei gleichem Stundenlohn = mehr Freizeit ohne Verlust pro Stunde.",
    ],
    intro: [
      "Dein Stundenlohn verrät mehr über dein reales Einkommen als dein Monatsgehalt. Ein Minijobber mit 12,82 EUR/Stunde verdient bei 10 Stunden/Woche anders als jemand mit 3.000 EUR/Monat bei 160 Stunden.",
      "Dieser Rechner zeigt dir deinen echten Stundenlohn, berücksichtigt Überstunden, Urlaub, Sonderzahlungen und Bundesland-Feiertage – so kannst du Jobangebote wirklich vergleichen.",
    ],
    howItWorks: [
      { title: "Monatsgehalt eingeben", description: "Brutto oder Netto? Der Rechner akzeptiert beides. Gib auch Sonderzahlungen (13. Monat, Bonusprogramme) ein." },
      { title: "Arbeitszeit definieren", description: "40h/Woche Standard? Oder 35h/Woche? Der Rechner rechnet hochmathematisch korrekt: 52 Wochen minus Urlaub/Feiertage." },
      { title: "Bundesland wählen", description: "In manchen Bundesländern gibt es mehr gesetzliche Feiertage (z.B. Bayern: 13, Bremen: 11). Das beeinflusst deine reale Arbeitszeit." },
      { title: "Überstunden berücksichtigen", description: "Machst du regelmäßig Überstunden? Der Rechner zeigt, wie viel das unterm Strich kostet (Burnout-Faktor!)." },
      { title: "Vergleich ablesen", description: "Dein echter Stundenlohn unterm Strich. Ist der Job mit 50 EUR/Woche Pendler-Kosten noch attraktiv?" },
    ],
    useCases: [
      "Mindestlohn-Check: Zahlt mein Arbeitgeber die vollen 12,82 EUR/Stunde (2025)?",
      "Jobangebote vergleichen: 2.500 EUR als Angestellter vs. 30 EUR/Stunde als Freelancer – was ist besser?",
      "Gehaltsverhandlung vorbereiten: Mit Stundenlohn-Rechnung argumentierst du stärker als mit Monatszahl.",
      "Überstunden bewerten: Lohnt sich die zusätzliche Stunde für 1,5x Lohn?",
      "Bundesland-Unterschiede: Bayern vs. Bremen – welcher Job ist fairer?",
      "Pendler-Kosten einrechnen: Wie viel bleibt netto nach Fahrtkosten/Bahncard?",
      "Werkstudent vs. Vollzeitstelle: 20h/Woche bei hohem Stundenlohn vs. 40h/Woche bei niedrigerem – Netto-Vergleich!",
    ],
    faqs: [
      {
        question: "Was ist der Mindestlohn 2025?",
        answer: "12,82 EUR pro Stunde. Das ist die Untergrenze – dein Arbeitgeber darf weniger nicht zahlen. Wenn ja, ist das illegal.",
      },
      {
        question: "Wie berechne ich meinen echten Stundenlohn?",
        answer: "Monatsgehalt ÷ (40h × 52 Wochen – Urlaub – Feiertage) = echter Stundelohn. Beispiel: 2.500 EUR ÷ 1.560h (40h × 39 Wochen) = 1,60 EUR/h. Warte – stimmt nicht! Rechner nutzen.",
      },
      {
        question: "Sind Urlaubstage in meiner Stundenlohn-Berechnung enthalten?",
        answer: "Ja! 30 Tage Urlaub = 6 Wochen weniger Arbeitszeit. Das sollte in die Rechnung rein, sonst wirkt dein Stundenlohn künstlich hoch.",
      },
      {
        question: "Wie viele Feiertage pro Bundesland? Macht das einen Unterschied?",
        answer: "Bayern hat 13, Bremen 11, Baden-Württemberg 12. Das sind bis zu 2 Tage pro Jahr Unterschied = etwa 16 EUR/Monat auf Vollzeitstellen.",
      },
      {
        question: "Überstundenausgleich: 1,5x Stundenlohn – ist das fair?",
        answer: "Branchenstandard. Das sollte der Arbeitsvertrag klar regeln. Unbezahlte Überstunden? Das ist illegal.",
      },
    ],
  },
  {
    slug: "spritrechner",
    title: "Spritrechner",
    metaTitle: "Spritrechner 2025 – Fahrtkosten, Pendlerpauschale & OEPNV-Vergleich | BeAFox",
    metaDescription:
      "Berechne Spritkosten fuer Benzin, Diesel, E-Auto oder Hybrid. Mit Fahrgemeinschaft, Pendlerpauschale, CO2-Bilanz und Deutschlandticket-Vergleich.",
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
      { label: "Vergleich: Deutschlandticket", isSectionHeader: true, key: "_sec5" },
      { label: "Deutschlandticket pro Jahr", key: "dticket_jahr" },
      { label: "Differenz (Auto vs. Ticket)", key: "diff_dticket" },
      { label: "Empfehlung", key: "dticket_vergleich" },
      // ── CO2 & Bewertung ──
      { label: "CO2-Bilanz & Bewertung", isSectionHeader: true, key: "_sec6" },
      { label: "CO2 pro Fahrt", key: "co2_pro_fahrt" },
      { label: "CO2 pro Jahr", key: "co2_pro_jahr" },
      { label: "Bewertung", key: "bewertung" },
    ],
    tips: [
      "Durchschnittsverbrauch: Kleinwagen 5-7 l, Mittelklasse 7-9 l, SUV 8-12 l, E-Auto 15-20 kWh/100km.",
      "E-Auto: Bei 0,30 EUR/kWh und 18 kWh/100km kosten 100km nur ca. 5,40 EUR – weniger als die Haelfte von Benzin!",
      "Deutschlandticket (58 EUR/Monat): Ab ca. 15-20km einfacher Pendelstrecke oft guenstiger als Auto.",
      "Pendlerpauschale 2025: 0,30 EUR/km (bis 20km) + 0,38 EUR/km (ab 21km) – gilt nur fuer einfache Strecke!",
      "Fahrgemeinschaft: 1 Mitfahrer halbiert die Kosten. Bei 25km Pendeln spart das ca. 80 EUR/Monat.",
      "Reifendruck pruefen! 0,5 bar zu wenig erhoehen den Verbrauch um ca. 5% – kostenlos optimierbar.",
      "Tempolimit: 120 statt 160 km/h auf der Autobahn spart bis zu 30% Sprit.",
      "Sprit-Apps (ADAC, clever-tanken) zeigen die guenstigste Tankstelle – spart 3-5 Cent/Liter.",
      "Hybrid-Tipp: Im Stadtverkehr moeglichst elektrisch fahren – dort ist der Verbrauchsvorteil am groessten.",
      "CO2-Kompensation: 1 Tonne CO2 kompensieren kostet ca. 25 EUR – fuer Vielfahrer eine Ueberlegung wert.",
    ],
    intro: [
      "Autofahren kostet schnell 300-500 EUR im Monat – wenn du das nicht kennst. Mit diesem Rechner siehst du genau, wie viel deine Fahrten kosten und wo du sparen kannst.",
      "Egal ob Pendler mit Fahrgemeinschaft, Urlaubsfahrten oder taeglich zum Nebenjob: Dieser Rechner zeigt dir die echten Kosten, Steuersparen durch Pendlerpauschale und ob der OEPNV guenstiger waere.",
    ],
    howItWorks: [
      {
        title: "Strecke & Fahrzeug eingeben",
        description: "Gib deine taegliche Strecke und dein Fahrzeug ein – ob Benzin, Diesel, E-Auto oder Hybrid.",
      },
      {
        title: "Verbrauch & Spritpreis",
        description: "Der Durchschnittsverbrauch ist voreingestellt (z.B. Benziner 7l/100km). Passe ihn an deine Realitaet an, ebenso die aktuellen Spritpreise.",
      },
      {
        title: "Fahrten pro Woche & Mitfahrer",
        description: "Wie oft faehrst du die Strecke pro Woche? Teilst du die Kosten mit Mitfahrern? Der Rechner rechnet es automatisch.",
      },
      {
        title: "Pendler-Optionen",
        description: "Wenn du fuer Arbeit pendelst: Gib deinen Steuersatz an, und der Rechner zeigt deine Steuerersparnis durch die Pendlerpauschale.",
      },
      {
        title: "Kosten sehen",
        description: "Du siehst sofort: Kosten pro Fahrt, pro Monat, pro Jahr, Einsparungen durch Mitfahrer, OEPNV-Vergleich und deine CO2-Bilanz.",
      },
    ],
    useCases: [
      "Pendlerkosten monatlich berechnen und budgetieren",
      "Auto vs. Deutschlandticket (58 EUR/Monat) vergleichen",
      "Mitfahren-Aufteilung mit Freunden berechnen",
      "CO2-Fussabdruck der Fahrten checken",
      "Gehaltsverhandlung: Zeig dem Chef deine Pendlerkosten",
      "Spritpreis-Aenderungen simulieren (Was kostet Sprit bei 2,50 EUR?)",
      "E-Auto vs. Benziner Wirtschaftlichkeit vergleichen",
    ],
    faqs: [
      {
        question: "Was ist die Pendlerpauschale?",
        answer: "2025: 0,30 EUR pro km (bis 20km Entfernung) + 0,38 EUR pro km (ab 21km). Das zaehlt nur die einfache Strecke. Du kannst sie als Werbungskosten von deiner Steuer abziehen.",
      },
      {
        question: "Deutschlandticket 58 EUR/Monat – ab wann lohnt sich das?",
        answer: "Ab ca. 15-20km einfacher Pendelstrecke wird der OEPNV oft guenstiger. Mit dem Ticket kannst du deutschlandweit alle Nahverkehrsmittel nutzen – das lohnt sich auch fuer Freizeits.",
      },
      {
        question: "Wie viel CO2 stoesst Autofahren aus?",
        answer: "Benziner: ca. 2,3 kg CO2 pro Liter. Diesel: ca. 2,7 kg CO2 pro Liter. E-Autos mit Oekostrom: ca. 0,1 kg CO2 pro kWh. Mit Normalmix: ca. 0,35 kg CO2 pro kWh.",
      },
      {
        question: "E-Auto Verbrauch – wie viel kWh kostet?",
        answer: "E-Autos verbrauchen 15-25 kWh pro 100km. Bei durchschnittlich 0,35 EUR/kWh (Heimladung) kostet eine Fahrt viel weniger als Benzin – etwa 5-9 EUR pro 100km statt 14-20 EUR.",
      },
      {
        question: "Kann ich mit Fahrgemeinschaft wirklich so viel sparen?",
        answer: "Ja! 1 Mitfahrer halbiert deine Kosten. Bei 25km Pendelstrecke (10 Fahrten/Woche) sparst du ca. 80-120 EUR pro Monat.",
      },
      {
        question: "Was ist Reifendruck-Optimierung?",
        answer: "Ein zu niedriger Reifendruck erhoet den Verbrauch um 5-10%. Wenn du ihn monatlich kontrollierst und auf Herstellerangaben haeltst, spart das ca. 1-2% Sprit – kostenlos!",
      },
    ],
  },
  {
    slug: "inflationsrechner",
    title: "Inflationsrechner",
    metaTitle: "Inflationsrechner – Kaufkraft, Realzins & Warenkorb | BeAFox",
    metaDescription: "Berechne Kaufkraftverlust, Realzins, Warenkorb-Projektion und Gehalts-Analyse. Mit historischen Daten und personalisierten Tipps fuer junge Menschen.",
    excerpt: "Wie viel ist dein Geld in 10 Jahren noch wert? Kaufkraft, Realzins & Warenkorb auf einen Blick.",
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
      { label: "Kaufkraft in heutigen Euro", key: "kaufkraft_zukunft", highlight: true },
      { label: "Kaufkraftverlust", key: "kaufkraft_verlust_euro" },
      { label: "Kaufkraftverlust in Prozent", key: "kaufkraft_verlust_prozent" },
      { label: "Benoetigter Betrag fuer gleiche Kaufkraft", key: "noetiger_betrag" },
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
      { label: "Gehalt in X Jahren (reale Kaufkraft)", key: "gehalt_zukunft_real" },
      { label: "Kaufkraftverlust pro Monat", key: "gehalt_kaufkraft_verlust_monat" },
      { label: "Kaufkraftverlust pro Jahr", key: "gehalt_kaufkraft_verlust_jahr" },
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
    tips: [
      "Die EZB strebt 2% Inflation an – in der Realitaet lag sie 2022 bei fast 7% in Deutschland.",
      "Die 72er-Regel: Teile 72 durch die Inflationsrate und du weisst, nach wie vielen Jahren sich die Preise verdoppeln.",
      "Geld auf dem Sparkonto mit 0% Zinsen verliert bei 2,5% Inflation in 10 Jahren ca. 22% seiner Kaufkraft.",
      "Breit gestreute ETFs (z.B. MSCI World) erzielen historisch ca. 7% p.a. – das schlaegt die Inflation deutlich.",
      "Gehaltsverhandlungen sollten MINDESTENS die Inflation ausgleichen – sonst bekommst du real weniger.",
    ],
    intro: [
      "Inflation frisst dein Erspartes – 10.000 EUR sind bei 2,5% Inflation in 10 Jahren nur noch 7.800 EUR wert. Mit diesem Rechner siehst du, wie schnell dein Geld seine Kaufkraft verliert.",
      "Ob Sparbuch, Tagesgeld oder ETF: Dieser Rechner zeigt dir, ob deine Zinsen und Sparplaene die Inflation schlagen – und wie du richtig vorsorgen musst.",
    ],
    howItWorks: [
      {
        title: "Betrag eingeben",
        description: "Gib den Geldbetrag ein, den du sparen moechtest oder den du bereits besitzt.",
      },
      {
        title: "Inflationsrate waehlen",
        description: "Die aktuelle deutsche Inflationsrate liegt bei ca. 2,5%. Du kannst sie anpassen, um verschiedene Szenarien zu rechnen.",
      },
      {
        title: "Zeitraum festlegen",
        description: "In wie vielen Jahren moechtest du wissen, wie viel dein Geld noch wert ist? 10, 20 oder 30 Jahre?",
      },
      {
        title: "Optional: Zinsen, Sparplan, Gehalt",
        description: "Wenn du regelmäßig sparest oder ein Sparbuch mit Zinsen hast, trag das ein – der Rechner berechnet dann, ob du mit Zinsen besser dasteht.",
      },
      {
        title: "Ergebnis ablesen",
        description: "Du siehst sofort: Kaufkraftverlust in EUR und Prozent, Realzins, deine Sparplan-Bilanz und wie dein Gehalt real aussieht.",
      },
    ],
    useCases: [
      "Kaufkraft deiner Ersparnisse berechnen",
      "Sparbuch vs. Inflation: Welche Zinsen brauchst du?",
      "Gehaltsverhandlung argumentieren: 'Keine Erhoehung = Gehaltssenkning bei Inflation'",
      "Warenkorb-Projektion: Wie viel kostet dein Einkaufen in 10 Jahren?",
      "Sparplandauer abschaetzen: Wie lange musst du sparen, um mit Inflation mithalten zu koennen?",
      "ETF-Rendite bewerten: Schlaegt 7% p.a. wirklich die Inflation?",
      "Taschengeld/BAfoeg real bewerten: Was ist es mit Inflation noch wert?",
    ],
    faqs: [
      {
        question: "Was ist Inflation?",
        answer: "Inflation ist die Teuerungsrate – Preise steigen durchschnittlich um ein paar Prozent pro Jahr. Das bedeutet: Dein Geld wird weniger wert, weil du dir immer weniger dafuer kaufen kannst.",
      },
      {
        question: "Wie hoch ist die aktuelle Inflationsrate in Deutschland?",
        answer: "2025 liegt die Inflationsrate bei ca. 2,5%. 2022-2023 war sie deutlich hoeher (6-7%). Die EZB strebt 2% an.",
      },
      {
        question: "Was ist Realzins?",
        answer: "Realzins = Nominalzins minus Inflation. Wenn dein Sparbuch 1% Zinsen gibt, aber Inflation 2,5% ist, dann verlierst du real 1,5% Kaufkraft pro Jahr!",
      },
      {
        question: "Wie schuetze ich mich vor Inflation?",
        answer: "1. Geld nicht auf dem Sparkonto lassen. 2. ETFs erzielen historisch ca. 7% p.a. – das schlaegt Inflation deutlich. 3. Nominal-Anleihen nutzen (z.B. TIPS). 4. Immobilien oder Sachwerte kaufen.",
      },
      {
        question: "Ist die 72er-Regel wirklich so nuetzlich?",
        answer: "Ja! Teile 72 durch die Inflationsrate, dann weisst du, nach wie vielen Jahren sich die Preise verdoppeln. Bei 2,5%: 72÷2,5 = 29 Jahre. Bei 3,6%: 20 Jahre.",
      },
      {
        question: "Warum erhoehe ich nicht mein Gehalt bei Gehaltsverhandlung um min. Inflation?",
        answer: "Weil du sonst real weniger verdienst! Wenn du 1.500 EUR verdienst und bekommst keine Erhoehung, aber Inflation ist 2,5%, dann kannst du dir real fuer 1.462,50 EUR so viel kaufen wie vorher.",
      },
    ],
  },
  {
    slug: "rentenluecken-rechner",
    title: "Rentenluecken-Rechner",
    metaTitle: "Rentenluecken-Rechner | BeAFox",
    metaDescription:
      "Berechne deine Rentenluecke, den Vermoegensbedarf und die noetige Sparrate – mit Inflation und Rendite.",
    excerpt:
      "Wie viel Geld fehlt dir im Alter – und was musst du jetzt tun?",
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
    tips: [
      "Das aktuelle Rentenniveau in Deutschland liegt bei ca. 48% – Tendenz sinkend bis 2035.",
      "Faustregel: Du brauchst im Alter ca. 80% deines aktuellen Einkommens, weil Kosten wie Pendeln und Arbeitskleidung wegfallen.",
      "Die 25er-Regel: Du brauchst das 25-Fache deiner jaehrlichen Rentenluecke als Vermoegen – dann kannst du 4% pro Jahr entnehmen.",
      "Je frueher du anfaengst privat vorzusorgen, desto weniger musst du monatlich zuruecklegen – der Zinseszins arbeitet fuer dich.",
      "Breit gestreute ETFs (z.B. MSCI World) erzielen historisch ca. 7% p.a. – das schlaegt die Inflation deutlich und eignet sich gut fuer langfristige Altersvorsorge.",
    ],
    intro: [
      "Die durchschnittliche gesetzliche Rente liegt bei ca. 1.100 EUR netto – und damit weit unter dem, was die meisten im Alter brauchen. Dieser Rechner zeigt dir deine persoenliche Rentenluecke und was du jetzt tun musst.",
      "Gib dein Alter, Gehalt und erwartete Rente ein – der Rechner berechnet die Luecke, beruecksichtigt Inflation und zeigt dir, wie viel du monatlich sparen musst, um deinen Lebensstandard im Alter zu halten.",
    ],
    howItWorks: [
      {
        title: "Alter & Renteneintritt eingeben",
        description:
          "Gib dein aktuelles Alter und dein gewuenschtes Renteneintrittsalter ein. Das Regelalter liegt bei 67, aber du kannst auch frueher oder spaeter planen.",
      },
      {
        title: "Einkommen & Wunschrente festlegen",
        description:
          "Dein Netto-Einkommen bestimmt, wie viel du im Alter brauchst. 80% ist die Faustregel – im Alter fallen Pendeln, Arbeitskleidung und Sparen weg.",
      },
      {
        title: "Gesetzliche Rente eintragen",
        description:
          "Deine erwartete Netto-Rente findest du auf deiner Renteninformation (kommt jaehrlich per Post). Durchschnitt 2025: ca. 1.200 EUR netto.",
      },
      {
        title: "Inflation & Rendite einstellen",
        description:
          "2% Inflation ist der EZB-Zielwert. 6% Rendite ist konservativ fuer breit gestreute ETFs. Der Rechner beruecksichtigt beides, um dir realistische Zahlen zu liefern.",
      },
      {
        title: "Sparplan ablesen",
        description:
          "Du siehst sofort: Deine Rentenluecke heute und inflationsbereinigt, das benoetigte Vermoegen und die monatliche Sparrate, um die Luecke zu schliessen.",
      },
    ],
    useCases: [
      "Rentenluecke monatlich & jaehrlich berechnen – heute und inflationsbereinigt",
      "Sparrate berechnen: Wie viel musst du monatlich in einen ETF-Sparplan stecken?",
      "Vermoegensbedarf fuer die Rente berechnen: Wie viel brauchst du auf dem Konto?",
      "Inflation einrechnen: Was ist deine Rente in 30 Jahren wirklich wert?",
      "Private Vorsorge (Riester, bAV, Ruerup) einordnen: Schliesst sie die Luecke?",
      "Fruehen Ruhestand planen: Wie viel mehr musst du sparen, wenn du mit 60 aufhoerst?",
      "Vorhandenes Vermoegen einrechnen: Wie viel deiner Luecke ist schon gedeckt?",
    ],
    faqs: [
      {
        question: "Was ist die Rentenluecke?",
        answer:
          "Die Rentenluecke ist die Differenz zwischen dem Einkommen, das du im Alter brauchst, und dem, was du tatsaechlich bekommst (gesetzliche Rente + private Vorsorge). Liegt deine Wunschrente bei 2.000 EUR, du bekommst aber nur 1.200 EUR Rente, fehlen dir 800 EUR/Monat.",
      },
      {
        question: "Wo finde ich meine erwartete gesetzliche Rente?",
        answer:
          "Ab 27 Jahren bekommst du jaehrlich eine Renteninformation per Post von der Deutschen Rentenversicherung. Dort steht dein voraussichtlicher Rentenanspruch. Du kannst sie auch online abrufen unter www.deutsche-rentenversicherung.de.",
      },
      {
        question: "Warum ist 80% des Nettogehalts eine gute Faustregel?",
        answer:
          "Im Alter fallen Kosten weg: Pendeln zur Arbeit, Berufskleidung, die Sparrate selbst. Gleichzeitig steigen Gesundheitskosten. Unter dem Strich reichen den meisten Menschen 70-80% ihres letzten Nettoeinkommens fuer denselben Lebensstandard.",
      },
      {
        question: "Warum beruecksichtigt der Rechner Inflation?",
        answer:
          "100 EUR heute sind nicht 100 EUR in 30 Jahren. Bei 2% Inflation brauchst du in 30 Jahren 181 EUR, um dir dasselbe kaufen zu koennen. Ohne Inflation-Beruecksichtigung unterschaetzt du deine Rentenluecke massiv.",
      },
      {
        question: "Was ist die 4%-Regel / 25er-Regel?",
        answer:
          "Die 4%-Regel besagt: Du kannst jaehrlich 4% deines Vermoegens entnehmen, ohne es aufzubrauchen (bei breit gestreutem Portfolio). Umgekehrt: Du brauchst das 25-Fache deiner jaehrlichen Luecke als Vermoegen. Bei 800 EUR/Monat Luecke = 9.600 EUR/Jahr × 25 = 240.000 EUR.",
      },
      {
        question: "Reichen 6% Rendite als Annahme?",
        answer:
          "Breit gestreute Aktien-ETFs (MSCI World, FTSE All-World) erzielen historisch ca. 7-8% p.a. vor Inflation. 6% ist eine konservative Annahme, die einen Puffer einbaut. Fuer risikoaermere Anlagen (Anleihen, Festgeld) solltest du 2-4% ansetzen.",
      },
    ],
  },
  {
    slug: "etf-kosten-rechner",
    title: "ETF-Kostenrechner",
    metaTitle: "ETF Kostenrechner | BeAFox",
    metaDescription:
      "Vergleiche, wie sich ETF-Gebuehren (TER) auf dein Vermoegen auswirken. Guenstiger ETF vs. teurer Fonds – mit Anfangskapital und Kostenaufstellung.",
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
    tips: [
      "Ein MSCI World ETF hat typischerweise eine TER von 0,12-0,22%. Der guenstigste (Amundi Prime Global) liegt bei 0,05%.",
      "Bei 100 EUR/Monat ueber 30 Jahre kostet dich 1,3% hoehere TER ueber 30.000 EUR an Vermoegen – das ist mehr als ein Kleinwagen.",
      "Achte beim ETF-Kauf auch auf den Tracking Difference (TD) – die TER allein sagt nicht alles. Ein ETF mit 0,2% TER aber negativer TD kann guenstiger sein als einer mit 0,1% TER.",
      "Thesaurierende ETFs reinvestieren Dividenden automatisch – das spart dir die Ordergebuehren und den Aufwand.",
      "Neobroker wie Trade Republic oder Scalable bieten kostenlose ETF-Sparplaene an – damit sparst du auch die Ordergebuehren.",
    ],
    intro: [
      "0,2% vs. 1,5% TER klingt nach fast nichts – aber bei 100 EUR Sparrate ueber 30 Jahre sind das ueber 30.000 EUR Unterschied. Dieser Rechner zeigt dir genau, wie viel dich teure Fonds wirklich kosten.",
      "Vergleiche guenstigen ETF vs. teuren Fonds: Endvermoegen, entgangene Rendite und die jaehrlichen Kosten auf einen Blick – damit du die richtige Entscheidung fuer dein Depot triffst.",
    ],
    howItWorks: [
      {
        title: "Anfangskapital & Sparrate eingeben",
        description:
          "Hast du schon Geld investiert? Gib es als Anfangskapital ein. Dazu deine monatliche Sparrate – beides wird verzinst und verglichen.",
      },
      {
        title: "Rendite und Zeitraum festlegen",
        description:
          "7% p.a. brutto ist fuer breit gestreute Aktien-ETFs (MSCI World) historisch realistisch. Je laenger der Zeitraum, desto groesser der Kosteneffekt.",
      },
      {
        title: "TER fuer beide Szenarien eintragen",
        description:
          "Links der guenstige ETF (z.B. 0,2% fuer MSCI World), rechts der teure Vergleich (z.B. 1,5% fuer einen aktiv gemanagten Fonds).",
      },
      {
        title: "Kostenvergleich ablesen",
        description:
          "Du siehst fuer jedes Szenario: Endvermoegen, Renditegewinn und die entgangene Rendite durch die TER. Plus den direkten Vorteil des guenstigen ETFs in EUR und Prozent.",
      },
      {
        title: "Entscheidung treffen",
        description:
          "Die Zahlen sprechen fuer sich: Selbst 0,3% TER-Unterschied summieren sich ueber Jahrzehnte zu Tausenden Euro. Weniger Kosten = mehr Vermoegen.",
      },
    ],
    useCases: [
      "ETF-Kosten vergleichen: Wie viel spart dir 0,05% vs. 0,2% vs. 1,5% TER?",
      "Aktiv vs. passiv: Lohnt sich der teure Fondsmanager wirklich?",
      "Depot-Check: Wie viel kosten dich deine aktuellen Fonds?",
      "Wechsel-Entscheidung: Rechnet sich der Umstieg auf einen guenstigeren ETF?",
      "Anfangskapital-Effekt: Wie stark wirkt die TER auf groessere Betraege?",
      "Langzeiteffekt visualisieren: 0,3% TER ueber 30 Jahre = ein Kleinwagen Unterschied",
      "Sparplan-Optimierung: Mit welchem ETF erreichst du dein Ziel schneller?",
    ],
    faqs: [
      {
        question: "Was ist die TER?",
        answer:
          "TER steht fuer Total Expense Ratio – die Gesamtkostenquote eines ETFs pro Jahr. Ein ETF mit 0,2% TER kostet dich 20 EUR pro Jahr bei 10.000 EUR Vermoegen. Die TER wird automatisch aus dem Fondspreis abgezogen, du zahlst sie also indirekt.",
      },
      {
        question: "Was sind typische ETF-Kosten?",
        answer:
          "MSCI World: 0,05-0,22%. S&P 500: 0,03-0,09%. FTSE All-World: 0,22%. Schwellenlaender: 0,18-0,5%. Themen-ETFs (KI, Clean Energy): 0,35-0,65%. Aktiv gemanagte Fonds: 1,5-2,5%.",
      },
      {
        question: "Schlagen aktive Fonds den Markt?",
        answer:
          "Fast nie. Laut SPIVA-Studie schlagen ueber 15 Jahre weniger als 10% der aktiven Fonds ihren Vergleichsindex. Und die wenigen, die es schaffen, rechtfertigen selten die 1-2% hoehere TER. Deshalb empfehlen Finanzexperten breit gestreute ETFs.",
      },
      {
        question: "Was ist der Unterschied zwischen TER und Tracking Difference?",
        answer:
          "Die TER zeigt die offiziellen Verwaltungskosten. Die Tracking Difference (TD) zeigt den tatsaechlichen Renditeunterschied zum Index – inklusive versteckter Kosten und Ertraege (z.B. Wertpapierleihe). Ein ETF mit 0,2% TER kann eine TD von nur 0,1% haben.",
      },
      {
        question: "Lohnt sich ein Wechsel zu guenstigeren ETFs?",
        answer:
          "Meistens ja! Aber rechne vorher: Beim Verkauf zahlst du Steuern auf Gewinne (26,375% KapESt). Wenn dein neuer ETF 0,5% guenstiger ist und du 10.000 EUR wechselst, hast du die Steuern nach 2-3 Jahren wieder drin. Tipp: Neues Geld sofort in den guenstigen ETF stecken.",
      },
      {
        question: "Gibt es versteckte Kosten bei ETFs?",
        answer:
          "Ja, neben der TER gibt es: Ordergebuehren beim Kauf/Verkauf (bei Neobrokern oft 0 EUR), den Spread (Differenz zwischen Kauf- und Verkaufskurs, ca. 0,01-0,1%), und die Tracking Difference. Insgesamt sind ETFs trotzdem deutlich guenstiger als aktive Fonds.",
      },
    ],
  },
  {
    slug: "waehrungsrechner",
    title: "Waehrungsrechner",
    metaTitle: "Waehrungsrechner | BeAFox",
    metaDescription: "Rechne Euro in andere Waehrungen um. Ideal fuer Reisen, Online-Shopping und Auslandssemester.",
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
    tips: [
      "Gaengige Kurse: 1 EUR ≈ 1,08 USD | 0,86 GBP | 162 JPY | 0,94 CHF | 11,8 SEK (Stand 2025).",
      "Am Flughafen wechseln ist teuer – nutze lieber Reisekreditkarten ohne Auslandsgebuehren.",
      "Beim Online-Shopping: Immer in der Lokalwaehrung bezahlen – die Umrechnung des Shops ist meist schlechter.",
    ],
    intro: [
      "Ob Urlaub, Online-Shopping oder Auslandssemester – Wechselkurse aendern sich taeglich. Mit diesem Rechner rechnest du schnell aus, wie viel dein Geld im Ausland wert ist.",
      "Wichtig: Zaehle auch die Bankgebuehren ein – sie sind oft versteckt und fressen deine Ersparnisse auf.",
    ],
    howItWorks: [
      {
        title: "Betrag in Euro eingeben",
        description: "Wie viel Geld moechtest du in eine andere Waehrung umrechnen? (z.B. 100 EUR fuer einen Kurzurlaub)",
      },
      {
        title: "Wechselkurs eingeben",
        description: "Der aktuelle Kurs wird normalerweise im Rechner voreingestellt. Du kannst ihn anpassen – Kurse aendern sich taeglich!",
      },
      {
        title: "Bankgebuehr angeben",
        description: "Wie viel Prozent Gebuehr verlangt deine Bank? Typisch: 1-3%. Ein Fehler: Am Flughafen zaehlen bis zu 8%!",
      },
      {
        title: "Umrechnung sehen",
        description: "Der Rechner zeigt: Betrag ohne Gebuehr, Gebuehr selbst, Endschlusslich bekoomener Betrag.",
      },
      {
        title: "Vergleichen",
        description: "Jetzt siehst du, wie viel die Gebuehren dir kosten – oft 15-30 EUR bei 100 EUR Umtausch!",
      },
    ],
    useCases: [
      "Urlaub planen: 500 EUR in USD/GBP/CHF umrechnen",
      "Online-Shopping: Amazon USA – wie teuer mit Versand?",
      "Auslandssemester budgetieren: Jahresbudget in andere Waehrung rechnen",
      "Gehalt im Ausland: Wie viel EUR sind 2.000 USD/CHF/GBP?",
      "Wechselkurs-Aenderungen testen: Was passiert bei Kurs-Aenderung um 2%?",
      "Bankgebuehren vergleichen: Online-Bank vs. Filialbanka – wie viel kostet das?",
      "Kreditkarte vs. Bargeld: Was ist guenstiger im Ausland?",
    ],
    faqs: [
      {
        question: "Wo bekomme ich den besten Wechselkurs?",
        answer: "Online-Dienste wie Wise oder Revolut haben die besten Kurse. Banken berechnen 1-3% Zuschlag. Am Flughafen: 4-8% Zuschlag. Niemals dort wechseln!",
      },
      {
        question: "Bargeld tauschen vs. Kreditkarte – was ist guenstiger?",
        answer: "Kreditkarte ohne Auslandsgebuehr (Wise, DKB) ist guenstiger. Bargeld tauschen im Land ist oft besser als am Flughafen. Geldautomaten sind oft in Ordnung.",
      },
      {
        question: "Was sind versteckte Gebuehren beim Wechsel?",
        answer: "1. Wechselgebuehrer (1-3%). 2. Makler-Marge (bis 2%). 3. Bargeld-Auszahlungsgebuehr (1-5%). 4. Mindestgebuehr (oft 5-10 EUR).",
      },
      {
        question: "Wechselkurs – Geld- oder Briefkurs?",
        answer: "Geldkurs: So viel die Bank dir gibt (schlechter). Briefkurs: So viel sie dir abkauft (besser fuer dich). Der Unterschied ist oft 1-3%.",
      },
      {
        question: "Sollte ich Fremdwaehrung vorher tauschen oder erst im Land?",
        answer: "Im Land tauschen ist meist besser – Laeden/Automaten bieten oft bessere Kurse als am Flughafen. Ausnahme: Zeitung, Kanada, USA – dort am Flughafen.",
      },
      {
        question: "Ist die Kreditkarte im Ausland sicherer als Bargeld?",
        answer: "Ja, meist sicherer. Aber: Immer PIN nehmen, nur serioeese Automaten (Bank/Flughafen), offline-Zahlungen vermeiden. Notfall-Kontakt der Bank mitschreiben.",
      },
    ],
  },
];

export const CALCULATOR_CATEGORIES = [
  { label: "Gehalt & Arbeit", emoji: "💼" },
  { label: "Sparen & Budget", emoji: "🎯" },
  { label: "Investieren", emoji: "📈" },
  { label: "Alltag & Lifestyle", emoji: "🏠" },
  { label: "Studium & Ausbildung", emoji: "🎓" },
  { label: "Rente & Vorsorge", emoji: "🏖️" },
];

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return CALCULATORS.find((calc) => calc.slug === slug);
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return CALCULATORS.filter((calc) => calc.category === category);
}
