import guide from "./guide";
import author from "./author";
import guideChapter from "./objects/guideChapter";
import comparisonTable from "./objects/comparisonTable";
import summaryBox from "./objects/summaryBox";
import costBarChart from "./objects/costBarChart";
import timeline from "./objects/timeline";
import statHighlight from "./objects/statHighlight";
import figureImage from "./objects/figureImage";
import { interactiveBlocks } from "./objects/interactive";

export const schemaTypes = [
  // Documents
  guide,
  author,
  // Objects
  guideChapter,
  comparisonTable,
  summaryBox,
  // Visual blocks
  costBarChart,
  timeline,
  statHighlight,
  figureImage,
  // Interactive blocks
  ...interactiveBlocks,
];
