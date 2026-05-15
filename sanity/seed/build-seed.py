#!/usr/bin/env python3
"""
Builds the Sanity import file for the example guide
"Auto kaufen oder leasen" — plus the three author documents it references.

Run:  python3 sanity/seed/build-seed.py
Then: npm run sanity:import

Dieser Ratgeber ist die lebende Vorlage (siehe sanity/RATGEBER-BLUEPRINT.md):
kompakte Prosa, Information in datengetriebenen Visual-Blöcken, klarer
Bea-Handoff pro Kapitel.

Autoren-Rotation: Die Redaktion wechselt bewusst zwischen Prof. Dr. Marcel
Dulgeridis, Alexandru Fuchs und Selina Fuchs ab. Dieser Ratgeber ist Prof. Dr.
Marcel Dulgeridis zugeordnet.
"""

import json
import os

_counter = [0]


def key(prefix="k"):
    _counter[0] += 1
    return f"{prefix}{_counter[0]}"


def span(text):
    return {"_type": "span", "_key": key("s"), "text": text, "marks": []}


def block(text, style="normal", list_item=None):
    b = {
        "_type": "block",
        "_key": key("b"),
        "style": style,
        "markDefs": [],
        "children": [span(text)],
    }
    if list_item:
        b["listItem"] = list_item
        b["level"] = 1
    return b


def para(text):
    return block(text, "normal")


def h3(text):
    return block(text, "h3")


def callout(kind, text):
    # kind: "info" | "tip" — rendered as its own box between the chapters
    return {"kind": kind, "text": text}


def bullet(text):
    return block(text, "normal", "bullet")


def ref(doc_id):
    return {"_type": "reference", "_ref": doc_id}


def author_doc(doc_id, name, slug, role, credentials, bio):
    return {
        "_id": doc_id,
        "_type": "author",
        "name": name,
        "slug": {"_type": "slug", "current": slug},
        "role": role,
        "credentials": credentials,
        "bio": bio,
    }


def chapter(heading, body, interactive, bea_prompt, callout_obj=None, visual_obj=None):
    interactive = dict(interactive)
    interactive["_key"] = key("int")
    doc = {
        "_type": "guideChapter",
        "_key": key("ch"),
        "heading": heading,
        "body": body,
        "interactive": [interactive],
        "beaPrompt": bea_prompt,
    }
    if visual_obj:
        visual_obj = dict(visual_obj)
        visual_obj["_key"] = key("vis")
        doc["visual"] = [visual_obj]
    if callout_obj:
        doc["callout"] = callout_obj
    return doc


def match_pairs(title, instruction, pairs):
    return {
        "_type": "matchPairs",
        "title": title,
        "instruction": instruction,
        "pairs": [
            {"_type": "pair", "_key": key("p"), "left": l, "right": r}
            for l, r in pairs
        ],
    }


def input_calc(question, hint, answer, tolerance, suffix):
    return {
        "_type": "inputCalc",
        "question": question,
        "hint": hint,
        "answer": answer,
        "tolerance": tolerance,
        "suffix": suffix,
    }


def inline_quiz(question, options, explanation):
    return {
        "_type": "inlineQuiz",
        "question": question,
        "options": [
            {
                "_type": "option",
                "_key": key("o"),
                "label": label,
                "correct": correct,
            }
            for label, correct in options
        ],
        "explanation": explanation,
    }


def this_or_that(question, option_a, option_b, correct, explanation):
    # option_a / option_b: (label, description) tuples; correct: "a" | "b"
    return {
        "_type": "thisOrThat",
        "question": question,
        "optionA": {"label": option_a[0], "description": option_a[1]},
        "optionB": {"label": option_b[0], "description": option_b[1]},
        "correct": correct,
        "explanation": explanation,
    }


def cost_bar_chart(heading, bars):
    # bars: list of (label, value, suffix, highlight) tuples
    return {
        "_type": "costBarChart",
        "heading": heading,
        "bars": [
            {
                "_type": "costBar",
                "_key": key("bar"),
                "label": label,
                "value": value,
                "suffix": suffix,
                "highlight": highlight,
            }
            for (label, value, suffix, highlight) in bars
        ],
    }


def timeline_visual(heading, steps):
    # steps: list of (label, detail) tuples
    return {
        "_type": "timeline",
        "heading": heading,
        "steps": [
            {"_type": "timelineStep", "_key": key("step"), "label": l, "detail": d}
            for (l, d) in steps
        ],
    }


def stat_highlight(heading, stats):
    # stats: list of (value, label) tuples
    return {
        "_type": "statHighlight",
        "heading": heading,
        "stats": [
            {"_type": "stat", "_key": key("stat"), "value": v, "label": l}
            for (v, l) in stats
        ],
    }


def faq_item(question, answer):
    return {
        "_type": "faqItem",
        "_key": key("faq"),
        "question": question,
        "answer": answer,
    }


def comparison_row(cells):
    return {"_type": "comparisonRow", "_key": key("row"), "cells": cells}


def comparison_table(heading, columns, rows):
    # Abschluss-Block-Variante 1: Vergleichstabelle.
    return {
        "_type": "comparisonTable",
        "_key": key("sum"),
        "heading": heading,
        "columns": columns,
        "rows": [comparison_row(cells) for cells in rows],
    }


def summary_box(heading, points):
    # Abschluss-Block-Variante 2: „Das Wichtigste in Kürze".
    return {
        "_type": "summaryBox",
        "_key": key("sum"),
        "heading": heading,
        "points": points,
    }


def source(label, url):
    return {"_type": "source", "_key": key("src"), "label": label, "url": url}


# ─── AUTOREN ─────────────────────────────────────────────────────────────────

authors = [
    author_doc(
        "author-marcel-dulgeridis",
        "Prof. Dr. Marcel Dulgeridis",
        "marcel-dulgeridis",
        "BeAFox-Redaktion",
        "Schwerpunkt Verbraucherfinanzen & Finanzbildung",
        "Prof. Dr. Marcel Dulgeridis forscht und lehrt zu Finanzwirtschaft und "
        "Verbraucherfinanzen. Bei BeAFox sorgt er dafür, dass komplexe "
        "Geldthemen fachlich korrekt und trotzdem verständlich erklärt werden.",
    ),
    author_doc(
        "author-alexandru-fuchs",
        "Alexandru Fuchs",
        "alexandru-fuchs",
        "BeAFox-Redaktion",
        "Verbraucher- und Finanzjournalismus",
        "Alexandru Fuchs schreibt seit Jahren über Geld, Verträge und die "
        "Fallen im Kleingedruckten. Er übersetzt Finanzthemen in klare, "
        "alltagstaugliche Entscheidungen, ganz ohne Fachchinesisch.",
    ),
    author_doc(
        "author-selina-fuchs",
        "Selina Fuchs",
        "selina-fuchs",
        "BeAFox-Redaktion",
        "Finanzbildung für junge Zielgruppen",
        "Selina Fuchs macht Finanzwissen für junge Menschen greifbar. Sie "
        "kennt die ersten großen Geldentscheidungen, vom ersten Auto bis zur "
        "ersten Wohnung, und erklärt sie Schritt für Schritt.",
    ),
]


# ─── RATGEBER ────────────────────────────────────────────────────────────────

guide = {
    "_id": "guide-auto-kaufen-oder-leasen",
    "_type": "guide",
    "title": "Auto kaufen oder leasen: Was ist wirklich günstiger?",
    "slug": {"_type": "slug", "current": "auto-kaufen-oder-leasen"},
    "category": "lebenssituation",
    "difficulty": "einsteiger",
    "readingTime": 7,
    "publishedAt": "2026-04-19",
    "author": ref("author-marcel-dulgeridis"),
    "metaTitle": "Auto kaufen oder leasen? Der ehrliche Kostenvergleich | BeAFox",
    "metaDescription": (
        "Leasing, Autokredit oder Barkauf: Was lohnt sich wirklich? Ehrlicher "
        "Vergleich mit echten Zahlen, interaktiven Rechnern und klarer "
        "Entscheidungshilfe."
    ),
    "excerpt": (
        "Leasing klingt günstig, doch wer die Gesamtkosten kennt, denkt oft um. "
        "Der ehrliche Vergleich zwischen Leasing, Autokredit und Barkauf, mit "
        "echten Zahlenbeispielen."
    ),
    "tags": ["Auto", "Leasing", "Autokredit", "Finanzierung", "Wertverlust"],
    "quickAnswer": (
        "Leasing, Autokredit oder doch bar bezahlen: Auf dem Papier wirkt mal "
        "die eine, mal die andere Variante günstiger. Der echte Unterschied "
        "zeigt sich erst, wenn du zwei Fragen ehrlich beantwortest: Wie lange "
        "willst du das Auto fahren, und was ist es am Ende noch wert? Genau da "
        "steigen wir jetzt ein."
    ),
    "chapters": [
        chapter(
            "Leasing, Finanzierung oder Barkauf: Wo ist der Unterschied?",
            [
                para(
                    "Kurz gesagt: Leasing hat die niedrigste Monatsrate, aber "
                    "am Ende gehört dir nichts. Mit einem Autokredit zahlst du "
                    "monatlich mehr, besitzt danach aber ein Auto mit Restwert. "
                    "Barkauf ist über die ganze Haltedauer fast immer am "
                    "günstigsten, wenn du das Geld entbehren kannst. Was passt, "
                    "hängt vor allem davon ab, wie lange du fährst."
                ),
                h3("Leasing: Miete statt Besitz"),
                para(
                    "Du nutzt das Auto für eine feste Laufzeit, zahlst monatlich "
                    "und gibst es danach zurück. Versicherung, Wartung und "
                    "Reparaturen trägst du selbst, obwohl das Auto nie dir "
                    "gehört. Dafür kennst du deine Kosten genau."
                ),
                h3("Finanzierung: Du baust Eigentum auf"),
                para(
                    "Beim Autokredit zahlst du den Kaufpreis in Raten ab. Das "
                    "Auto ist die Sicherheit der Bank, deshalb sind die Zinsen "
                    "meist günstig. Nach der letzten Rate gehört es dir. "
                    "Vorsicht bei Ballon- und Drei-Wege-Finanzierung: niedrige "
                    "Rate, dafür eine hohe Schlussrate."
                ),
                h3("Barkauf: Volle Kontrolle, kein Zinsrisiko"),
                para(
                    "Du zahlst sofort den vollen Preis: keine Zinsen, sofort "
                    "Eigentümer, jederzeit verkaufbar. Der Haken: Eine große "
                    "Summe ist auf einen Schlag weg. Dein Notgroschen sollte "
                    "danach trotzdem stehen."
                ),
            ],
            match_pairs(
                "Kennst du die Unterschiede?",
                "Klick erst einen Begriff links an, dann die passende "
                "Erklärung rechts.",
                [
                    ("Leasing", "Du mietest: kein Eigentum, nur Halter"),
                    ("Autokredit", "Bank hält den Brief bis zur letzten Rate"),
                    (
                        "Barkauf",
                        "Alles sofort bezahlt: sofort Eigentümer, keine Zinsen",
                    ),
                    (
                        "Ballonfinanzierung",
                        "Niedrige Rate + hohe Schlussrate am Ende",
                    ),
                ],
            ),
            "Erklär mir den Unterschied zwischen Leasing, Autokredit und "
            "Barkauf an meinem Beispiel.",
            callout(
                "info",
                "Beim Autokredit hält die Bank den Fahrzeugbrief, bis du die "
                "letzte Rate bezahlt hast. Rechtlich Eigentümer wirst du also "
                "erst nach der letzten Rate, auch wenn du das Auto längst "
                "fährst.",
            ),
        ),
        chapter(
            "Was kostet es wirklich? Das ehrliche Zahlenbeispiel",
            [
                para(
                    "Die Monatsrate allein sagt fast nichts. Entscheidend sind "
                    "die Gesamtkosten, und was am Ende noch übrig ist. Beispiel "
                    "VW Golf: 27.180 € Neupreis, 48 Monate Laufzeit, Restwert "
                    "nach 4 Jahren rund 13.046 €."
                ),
                para(
                    "Der Knackpunkt ist der Restwert. Beim Kredit besitzt du "
                    "danach ein Auto im Wert von rund 13.046 €. Rechnest du "
                    "das gegen, liegen Kredit und Leasing fast gleichauf, nur "
                    "dass dir das Auto gehört. Beim Barkauf ist die Differenz "
                    "am kleinsten, weil keine Zinsen anfallen."
                ),
                h3("Versteckte Kosten treffen alle drei"),
                para(
                    "Versicherung, Steuer, Wartung, Reifen und Wertverlust "
                    "fallen bei jeder Variante an. Rechne nie nur die Rate, "
                    "sondern die Vollkosten pro Monat. Faustregel: plane "
                    "nochmal etwa so viel wie die Rate für Unterhalt ein."
                ),
            ],
            input_calc(
                "Autokredit gesamt: 30.639 €. Restwert des Autos nach 4 Jahren: "
                "13.046 €. Was sind die effektiven Kosten, wenn du das Auto "
                "behältst?",
                "Gesamtkosten minus Restwert des Autos.",
                17593,
                100,
                "€",
            ),
            "Rechne mir die echten Gesamtkosten für mein Wunschauto über die "
            "Laufzeit aus.",
            callout(
                "tip",
                "Wer sein Auto lange fährt, gewinnt: Nach dem Kredit fährst "
                "du nur noch laufende Kosten. Beim Leasing startest du sofort "
                "den nächsten Vertrag.",
            ),
            cost_bar_chart(
                "Effektive Kosten über 4 Jahre (VW Golf, Restwert gegengerechnet)",
                [
                    ("Barkauf", 14134, "€", True),
                    ("Leasing", 17136, "€", False),
                    ("Autokredit", 17593, "€", False),
                ],
            ),
        ),
        chapter(
            "Welche Variante passt zu dir?",
            [
                para(
                    "Die richtige Antwort hängt von deiner Nutzungsdauer, "
                    "deinem Fahrprofil und deiner Steuersituation ab."
                ),
                h3("Sonderfall Selbstständige"),
                para(
                    "Geschäftlich genutzt rechnet es sich anders: Leasingraten "
                    "sind meist voll absetzbar, beim Kauf setzt du Zinsen und "
                    "die Abschreibung über Jahre ab. Was netto günstiger ist, "
                    "hängt vom Steuersatz ab. Kläre das am besten mit dem Steuerberater."
                ),
                h3("Sonderfall E-Auto"),
                para(
                    "E-Autos verlieren anfangs oft schneller an Wert. Deshalb "
                    "ist Leasing hier beliebt: Das Restwertrisiko trägt der "
                    "Anbieter, und Hersteller subventionieren E-Leasing oft. Wer "
                    "lange behalten will, fährt mit Kauf trotzdem meist günstiger."
                ),
                para(
                    "Und wenn Leasing: immer Kilometerleasing, nie "
                    "Restwertleasing. Beim Kilometerleasing kennst du deine "
                    "Kosten von Anfang an."
                ),
            ],
            inline_quiz(
                "Du fährst 25.000 km im Jahr und willst das Auto mindestens 8 "
                "Jahre behalten. Was passt besser?",
                [
                    ("Restwertleasing, die niedrige Rate spart am meisten", False),
                    (
                        "Autokredit, bei langer Nutzung und vielen km klar "
                        "günstiger",
                        True,
                    ),
                    ("Drei-Wege-Finanzierung, maximale Flexibilität", False),
                ],
                "Bei hoher Fahrleistung und langer Haltedauer ist der Autokredit "
                "fast immer am günstigsten: Du zahlst keine Mehrkilometer und "
                "fährst nach der letzten Rate quasi kostenlos weiter.",
            ),
            "Frag mich ein paar Fragen und sag mir, ob Leasing, Kredit oder "
            "Barkauf besser zu mir passt.",
            callout(
                "info",
                "Faustregel: Langfristig behalten und Ruhe bei der Rückgabe "
                "wollen → Autokredit oder Barkauf. Alle 2–4 Jahre wechseln und "
                "steuerlich profitieren → Kilometerleasing.",
            ),
            stat_highlight(
                "Zwei Zahlen entscheiden meistens",
                [
                    (
                        "5+ Jahre",
                        "Ab dieser Haltedauer ist Kauf oder Kredit fast immer "
                        "günstiger als Leasing.",
                    ),
                    (
                        "20.000 km",
                        "Ab dieser Jahresfahrleistung wird Leasing durch "
                        "Mehrkilometer schnell teuer.",
                    ),
                ],
            ),
        ),
        chapter(
            "Bevor du unterschreibst: Diese Vertragsfallen kosten dich",
            [
                para(
                    "Der Vertrag entscheidet über deine echten Kosten, nicht "
                    "der Aufkleber im Schaufenster. Geh ihn in vier Schritten "
                    "durch, bevor du unterschreibst."
                ),
                para(
                    "Zwei Dinge noch obendrauf: Beim Leasing die "
                    "Rückgabe-Bedingungen genau prüfen, denn Kratzer und "
                    "Mehrkilometer werden teuer. Und eine Anzahlung senkt nur "
                    "die Rate, nicht die Gesamtkosten."
                ),
            ],
            this_or_that(
                "Was senkt deine Gesamtkosten beim Autokredit wirklich?",
                (
                    "Eine hohe Anzahlung",
                    "Die Monatsrate sinkt spürbar.",
                ),
                (
                    "Kurze Laufzeit, niedriger Zins",
                    "Du zahlst insgesamt weniger Zinsen.",
                ),
                "b",
                "Eine Anzahlung senkt nur die Rate, nicht die Gesamtkosten. Du "
                "zahlst trotzdem den vollen Preis plus Zinsen. Wirklich "
                "günstiger wird es über einen niedrigen effektiven Jahreszins "
                "und eine kurze Laufzeit.",
            ),
            "Geh meinen Autokredit- oder Leasingvertrag mit mir durch und sag "
            "mir, worauf ich achten muss.",
            callout(
                "tip",
                "Nimm den Vertrag mit nach Hause und schlaf eine Nacht drüber. "
                "Seriöse Händler machen da keinen Druck.",
            ),
            timeline_visual(
                "Vertrags-Check vor der Unterschrift",
                [
                    (
                        "Effektiven Jahreszins vergleichen",
                        "Nicht die Monatsrate. Im Effektivzins stecken alle "
                        "Gebühren. Schon 1 % macht hunderte Euro aus.",
                    ),
                    (
                        "Optionale Extras streichen",
                        "Restschuldversicherung, Schutzbrief und "
                        "Wartungspaket sind fast immer freiwillig. Lass dir "
                        "den Preis ohne Extras zeigen.",
                    ),
                    (
                        "Schlussrate realistisch einplanen",
                        "Bei Ballonfinanzierung: Kannst du sie zahlen, das Auto "
                        "verkaufen oder umschulden? Sonst droht ein teurer "
                        "Anschlusskredit.",
                    ),
                    (
                        "Eine Nacht drüber schlafen",
                        "Seriöse Händler machen keinen Druck. Druck ist selbst "
                        "schon ein Warnzeichen.",
                    ),
                ],
            ),
        ),
    ],
    "summary": [
        comparison_table(
            "Leasing, Autokredit und Barkauf im Direktvergleich",
            ["Kriterium", "Leasing", "Autokredit", "Barkauf"],
            [
                ["Eigentum am Ende", "Nein", "Ja", "Ja"],
                [
                    "Monatliche Belastung",
                    "Niedrig",
                    "Mittel bis hoch",
                    "Einmalig",
                ],
                [
                    "Gesamtkosten über die Haltedauer",
                    "Mittel",
                    "Mittel",
                    "Am niedrigsten",
                ],
                [
                    "Auto alle paar Jahre wechseln",
                    "Sehr einfach",
                    "Aufwändig",
                    "Aufwändig",
                ],
                [
                    "Risiko Wertverlust",
                    "Trägt der Anbieter",
                    "Trägst du",
                    "Trägst du",
                ],
                [
                    "Steuer (Selbstständige)",
                    "Raten voll absetzbar",
                    "Zinsen + AfA",
                    "AfA über mehrere Jahre",
                ],
                [
                    "Passt für",
                    "Wer oft wechselt",
                    "Wer lange fährt",
                    "Wer das Geld flüssig hat",
                ],
            ],
        )
    ],
    "beaBlock": {
        "intro": (
            "Unsicher, welche Variante zu deiner Situation passt? Frag Bea. Sie "
            "rechnet mit deinen Zahlen und führt dich Schritt für Schritt zur "
            "Entscheidung."
        ),
        "questions": [
            "Lohnt sich Leasing für mich, wenn ich 15.000 km im Jahr fahre?",
            "Wie viel Auto kann ich mir bei meinem Nettoeinkommen leisten?",
            "Worauf muss ich beim Autokredit-Vertrag besonders achten?",
        ],
    },
    "faq": [
        faq_item(
            "Ist Leasing oder Finanzierung günstiger?",
            "Über die reine Monatsrate ist Leasing meist günstiger. Rechnet man "
            "den Restwert des Autos mit ein, ist ein Autokredit bei längerer "
            "Nutzung fast immer die günstigere Wahl. Am wenigsten kostet über "
            "die gesamte Haltedauer in der Regel der Barkauf, weil keine Zinsen "
            "anfallen.",
        ),
        faq_item(
            "Was ist der Unterschied zwischen Kilometer- und Restwertleasing?",
            "Beim Kilometerleasing zahlst du nach gefahrenen Kilometern, das ist "
            "kalkulierbar. Beim Restwertleasing trägst du das Risiko, wenn das "
            "Auto bei Rückgabe weniger wert ist als geschätzt.",
        ),
        faq_item(
            "Wie viel Auto kann ich mir leisten?",
            "Als Faustregel sollten alle Autokosten zusammen, also Rate, "
            "Versicherung, Steuer, Sprit und Wartung, höchstens 15 bis 20 % deines "
            "Nettoeinkommens ausmachen.",
        ),
    ],
    "sources": [
        source(
            "ADAC: Leasing, Finanzierung oder Barzahlung",
            "https://www.adac.de/rund-ums-fahrzeug/autokatalog/autokauf/",
        ),
        source(
            "Stiftung Warentest: Autokredite im Vergleich",
            "https://www.test.de/Autokredite/",
        ),
        source(
            "Verbraucherzentrale: Auto finanzieren und leasen",
            "https://www.verbraucherzentrale.de/",
        ),
    ],
}


# ─── OUTPUT ──────────────────────────────────────────────────────────────────

out_path = os.path.join(os.path.dirname(__file__), "auto-kaufen-oder-leasen.ndjson")
with open(out_path, "w", encoding="utf-8") as f:
    # Autoren zuerst — damit die Referenz im Guide sofort auflöst.
    for doc in authors:
        f.write(json.dumps(doc, ensure_ascii=False))
        f.write("\n")
    f.write(json.dumps(guide, ensure_ascii=False))
    f.write("\n")

print(f"Wrote {out_path} — {len(authors)} Autoren + 1 Ratgeber")
