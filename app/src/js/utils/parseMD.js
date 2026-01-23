import {marked} from 'marked';

/* Unit test */
const text = "# Introduction\n" +
  "\n" +
  "* Heilmittelgesetz (HMG, SR 812.21)\n" +
  "* Medizinprodukteverordnung (MepV, SR 812.213)\n" +
  "* Verordnung über In-Vitro-Diagnostika (IvDV, SR 812.219)\n" +
  "* Humanforschungsgesetz (HFG, SR 813.30)\n" +
  "\n" +
  "Verordnung über klinische Versuche mit Medizinprodukten (KlinV-Mep, SR 810.306)\n" +
  "\n" +
  "Abkommen mit europäischer Gemeinschaft, obige Rechtsvorschriften sind mit denjenigen der EU angeglichen. Insbesondere:\n" +
  "\n" +
  "* Medical Device Regulation (MDR)\n" +
  "* In Vitro Diagnostic Regulation (IVDR)\n" +
  "\n" +
  "## Bundesmittelgesetz über Arzneimittel und Medizinprodukte (Heilmittelgesetz, HMG)\n" +
  "\n" +
  "Gestützt auf Art. 95 Absatz 1 und Art. 118 Absatz 2 der Bundesverfassung.\n" +
  "\n" +
  "### Art. 95 Absatz 1\n" +
  "Der Bund kann Vorschriften erlassen über die Ausübung der privatwirtschaftlichen Erwerbstätigkeit.\n" +
  "\n" +
  "### Art. 118 Absatz 2\n" +
  "Er (der Bund) erlässt Vorschriften über:\n" +
  "\n" +
  "* Umgang mit Lebensmitteln / Heilmitteln, Betäubungsmitteln, Organismen, Chemikalien und Gegenständen, welche die Gesundheit gefährden können;\n" +
  "* die Bekämpfung übertragbarer, stark verbreiteter oder bösartiger Krankheiten von Menschen und Tieren;\n" +
  "* den Schutz vor ionisierenden Strahlen.\n" +
  "\n" +
  "## Heilmittelgesetz, HMG\n" +
  "\n" +
  "**Zweck:**\n" +
  "* Schutz der Gesundheit von Mensch und Tier, nur qualitativ hoch stehende, sichere und wirksame Heilmittel in Verkehr bringen\n" +
  "* Konsument:innen von Heilmitteln vor Täuschung schützen\n" +
  "* dazu beitragen, dass Heilmittel ihrem Zweck entsprechend und massvoll verwendet werden\n" +
  "* dazu beitragen, dass sichere und geordnete Versorgung von Heilmitteln angeboten wird\n" +
  "* Alle miteinander im Wettbewerb stehenden Marktpartner den gleichen gesetzlichen Sicherheits- und Qualitätsanforderungen genügen.\n" +
  "\n" +
  "## Definition «Heilmittel»\n" +
  "\n" +
  "Werden bei Erkennung, Verhütung und Behandlung von Krankheiten, Verletzungen und Behinderungen eingesetzt.\n" +
  "\n" +
  "### Arzneimittel\n" +
  "* Chemisch oder biologischer Ursprung\n" +
  "* Zur medizinischen Einwirkung auf menschlichen oder tierischen Organismus\n" +
  "* Auch Blut und Blutprodukte\n" +
  "* HMG Art. 4 §a\n" +
  "\n" +
  "### Medizinprodukte\n" +
  "* Einschliesslich Instrumente, Apparate, Geräte, In-Vitro-Diagnostika, Software, Implantate, Reagenzien, Materialien und andere Gegenstände oder Stoffe\n" +
  "* Für medizinische Verwendung bestimmt\n" +
  "* Wenn Hauptwirkung nicht durch Arzneimittel erreicht wird\n" +
  "\n" +
  "## Sorgfaltspflicht (HMG Art. 3)\n" +
  "Wer mit Heilmitteln umgeht, muss dabei alle Massnahmen treffen, die nach dem Stand von Wissenschaft und Technik erforderlich sind, damit die Gesundheit von Mensch und Tier nicht gefährdet wird.\n" +
  "\n" +
  "## Medizinprodukte Anforderungen (HMG Art. 45)\n" +
  "\n" +
  "* Medizinprodukt darf bei bestimmungsgemässer Verwendung Gesundheit Anwender:innen, Konsument:innen, Patient:innen und Dritter nicht gefährden.\n" +
  "* Vorgesehene Leistung muss nachgewiesen werden.\n" +
  "* Wer Medizinprodukt in Verkehr bringt, muss Erfüllung der grundlegenden Anforderungen nachweisen können.\n" +
  "\n" +
  "**Bundesrat legt Anforderungen fest. Er bestimmt:**\n" +
  "* Grundlegende Sicherheits- und Leistungsanforderungen.\n" +
  "* Regeln ihrer Klassifizierung.\n" +
  "* Sprachen für die Produktinformationen.\n" +
  "* Kennzeichnung der Produkte.\n" +
  "\n" +
  "Institut bezeichnet im Einvernehmen mit Staatssekretariat Wirtschaft technische Normen und gemeinsame Spezifikationen, um grundlegende Anforderungen zu konkretisieren. Soweit möglich international harmonisierte Normen.\n" +
  "\n" +
  "## Konformitätsbewertungsverfahren (HMG Art. 46)\n" +
  "Wer Medizinprodukt in Verkehr bringt, muss nachweisen können, dass erforderliche Konformitätsbewertungsverfahren durchgeführt worden sind.\n" +
  "Bundesrat regelt Konformitätsbewertungsverfahren.\n" +
  "\n" +
  "## Registrierung und Produktidentifikation\n" +
  "Hersteller muss Medizinprodukt im Informationssystem oder europäischen Datenbank für Medizinprodukte (Eudamed) registrieren.\n" +
  "Eindeutiger Produktidentifikator notwendig.\n" +
  "\n" +
  "## Instandhaltungspflicht\n" +
  "Wer ein Medizinprodukt gewerblich oder an Dritten einsetzt, muss alle Massnahmen für Instandhaltung treffen, die für Erhalt der Leistung und Sicherheit erforderlich sind.\n" +
  "\n" +
  "## Strafbestimmungen\n" +
  "Bestraft wird, wer vorsätzlich:\n" +
  "* Medizinprodukt in Verkehr bringt, dass den Anforderungen des Gesetzte nicht entspricht.\n" +
  "* Sorgfaltspflicht oder Instandhaltungspflicht verletzt.\n" +
  "\n" +
  "**Definition «Medical Device» gemäss MDR**\n" +
  "Siehe Abschnitt Medizinprodukte, für spezifische medizinische Zwecke:\n" +
  "* Diagnose, Prävention, Überwachung, Vorhersage, Prognose, Behandlung oder Linderung von Krankheiten\n" +
  "* Diagnose, Überwachung, Behandlung und Linderung oder Kompensation von Verletzungen oder Behinderungen\n" +
  "* Untersuchung, Ersatz oder Modifikation der Anatomie, eines physiologischen oder pathologischen Prozesses oder Zustand\n" +
  "* Informationen durch In-Vitro-Untersuchungen durch Proben bereitstellen, welche aus menschlichem Körper gewonnen werden (Organe, Blut, Gewebe)\n" +
  "\n" +
  "### Beispiel App\n" +
  "* «The app is intended to be used by a healthy user to maintain a healthy weight and encourage healthy eating.»  \n" +
  "  → Kein Medizinprodukt, App ist für Wohlbefinden\n" +
  "* «The app is intended to be used by anorexic patient to treat an eating disorder / anorexia.»  \n" +
  "  → App ist Medizinprodukt.\n" +
  "\n" +
  "## Klassifizierungen gemäss MDR\n" +
  "\n" +
  "| Klasse | Beispiele |\n" +
  "| :--- | :--- |\n" +
  "| **Class I** | Rollstuhl, Otoskop, Spitalbett |\n" +
  "| **Class I\\*** | Sterile Produkte, Produkte mit Messfunktion, wiederaufbereitbare chirurgische Instrumente |\n" +
  "| **Class IIa** | Ultraschallgeräte, Zahfüllungen, Hörgeräte, Smarte Wearables, klinische Thermometer, Blutdruck-Messgeräte |\n" +
  "| **Class IIb** | Beatmungsgeräte, Röntgengeräte, Strahlentherapie-Ausrüstung, einfache Knochenimplantate |\n" +
  "| **Class III** | Die meisten Implantate, Wirbelsäulenkorb, Herzschrittmacher |\n" +
  "\n" +
  "## Klassifizierungsregeln gemäss MDR\n" +
  "Total 22 Regeln zur Klassifizierung:\n" +
  "* Regeln 1-4 → Nicht-Invasive Produkte\n" +
  "* Regeln 5-8 → Invasive Produkte\n" +
  "* Regeln 9-12 → Aktive Produkte\n" +
  "* Regeln 13-22 → Spezielle Regeln\n" +
  "\n" +
  "## Ausserhalb von Europa (FDA)\n" +
  "* Instrument, Gerät, Maschine, Implantat, Reagenz oder Zubehör.\n" +
  "* Zweck: Diagnose, Heilung, Linderung oder Vorbeugung von Krankheiten.\n" +
  "* Beeinflussung von Körperstruktur oder -funktionen (Mensch/Tier).\n" +
  "\n" +
  "![Some random code screenshot](https://cdn.hashnode.com/res/hashnode/image/upload/v1677781943492/c64cae30-2543-4bd8-be4c-54f9871a3c8d.png 'Random screenshot')\n" +
  "### Wirkweise (Abgrenzung zu Medikamenten):\n" +
  "* Keine primär chemische Wirkung im/am Körper.\n" +
  "* Keine Abhängigkeit vom Stoffwechsel (Metabolisierung).\n" +
  "* Status: Anerkannt durch offizielle Arzneibücher (z. B. USP).\n" +
  "\n" +
  "### Klassifizierungsregeln gemäss FDA\n" +
  "\n" +
  "| Klasse | Beispiele |\n" +
  "| :--- | :--- |\n" +
  "| **Class I** | Untersuchungshandschuhe, mechanischer Rollstuhl |\n" +
  "| **Class II** | Diagnostischer Ultraschall, die meisten IVD-Geräte |\n" +
  "| **Class III** | Aktive implantierbare Geräte |\n" +
  "\n" +
  "### Policy for Low-Risk devices\n" +
  "* **Zielgruppe:** Medizinprodukte & Entscheidungsunterstützungs-Tools mit geringem Risiko.\n" +
  "* **Regel:** Verzicht auf übliche Produkt- oder Dokumentenprüfung durch die FDA.\n" +
  "* **Vorteil:** Direkte Markteinführung ohne vorherige Genehmigung möglich.\n" +
  "* **Besonderheit:** Besonders vorteilhaft für Software-Produkte.\n" +
  "\n" +
  "## Technische Dokumentation\n" +
  "Ist obligatorisch. Beinhaltet zusammengefasst eine Sammlung aller Informationen über ein Produkt, welche benötigt werden, um die Einhaltung der gesetzlichen Anforderungen zu überprüfen (z.B. Sicherheit und Leistung).\n" +
  "\n" +
  "### Lebenszyklus\n" +
  "* Mehrere Stakeholder tragen dazu bei und verwenden die Dokumentation während dem ganzen Lebenszyklus des Produkts\n" +
  "* Gleichzeitig dient Dokumentation als Basis für Genehmigung von regulatorischen Behörden";


const html = marked.parse(`<div class='page'>${text}</div><div class='page'>${text}</div>`);
const renderView = document.getElementById("render_wrapper");

renderView.innerHTML = html;