import {marked} from 'marked';

/* Unit test */
const text = "# Introduction\n" +
  "- Heilmittelgesetz (HMG, SR 812.21)\n" +
  "- Medizinprodukteverordnung (MepV, SR 812.213)\n" +
  "- Verordnung über In-Vitro-Diagnostika (IvDV, SR 812.219)\n" +
  "- Humanforschungsgesetz (HFG, SR 813.30)\n" +
  "- Verordnung über klinische Versuche mit Medizinprodukten (KlinV-Mep, SR 810.306)\n" +
  "\n" +
  "Abkommen mit europäischer Gemeinschaft, obige Rechtsvorschriften sind mit denjenigen der EU angeglichen. Insbesondere:\n" +
  "- Medical Device Regulation (MDR)\n" +
  "- In Vitro Diagnostic Regulation (IVDR)\n" +
  "\t- Second level\n" +
  "\n" +
  "## Bundesmittelgesetz über Arzneimittel und Medizinprodukte (Heilmittelgesetz, HMG)\n" +
  "Gestützt auf Art. 95 Absatz 1 und Art. 118 Absatz 2 der Bundesverfassung.\n" +
  "\n" +
  "### Art. 95 Absatz 1\n" +
  "Der Bund kann Vorschriften erlassen über die Ausübung der privatwirtschaftlichen Erwerbstätigkeit.\n" +
  "### Art. 118 Absatz 2\n" +
  "Er (der Bund) erlässt Vorschriften über:\n" +
  "- Umgang mit Lebensmitteln / Heilmitteln, Betäubungsmitteln, Organismen, Chemikalien und Gegenständen, welche die Gesundheit gefährden können;\n" +
  "- Die Bekämpfung übertragbarer, stark verbreiteter oder bösartiger Krankheiten von Menschen und Tieren;\n" +
  "- den Schutz vor ionisierenden Strahlen.";

const html = marked.parse(text);
const renderView = document.getElementById("render_wrapper");

renderView.innerHTML = html;