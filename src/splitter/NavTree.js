import { GENERIC_NAV } from "../utils";
import extractSubConf from "./extractSubConf";
import { orderNavByName } from "./extractSubNavs";
import { extractTree, findRelTree } from "./extractTree";

export default class NavTree {
  constructor(schema, uiSchema) {
    this.tree = extractTree(schema, uiSchema);
    console.dir(this.tree);
    this.schema = schema;
    this.uiSchema = uiSchema;
  }

  pushToTabFromTree = (relTree, activeNavs) => {
    let orderedNavs = orderNavByName(Object.keys(relTree), this.uiSchema);
    let nextNav = orderedNavs.find(nav => nav !== GENERIC_NAV);
    if (nextNav) {
      activeNavs.push(nextNav);
      this.pushToTabFromTree(relTree[nextNav], activeNavs);
    }
  };

  updateActiveNav = activeNavs => {
    let relTree = findRelTree(this.tree, activeNavs);
    this.pushToTabFromTree(relTree, activeNavs);
  };

  toSubForms = activeNav => {
    let agg = [];
    for (let i = 0; i <= activeNav.length; i++) {
      let subConf = extractSubConf(
        activeNav.slice(0, i),
        this.tree,
        this.schema,
        this.uiSchema
      );
      if (subConf.schema || subConf.navs.links.length > 0) {
        agg.push(subConf);
      }
    }
    return agg;
  };
}
