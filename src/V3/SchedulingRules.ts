import ResourceServiceBase, { ResourceReadable, ResourceSearchable } from './ResourceServiceBase';

type SchedulingRuleType = {
  id: number,
  environmentId: number,
  name: string,
  type: string,
  data: string,
  created: string,
  updated: string,
};

type SchedulingRuleSearchParams = {
  page?: number,
  itemsPerPage?: number,
};

class SchedulingRulesServiceBase extends ResourceServiceBase<SchedulingRuleType> {
  collectionPath() { return "/scheduling-rules" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const SchedulingRulesServiceReadable = ResourceReadable<
  typeof SchedulingRulesServiceBase, SchedulingRuleType
>(SchedulingRulesServiceBase);
const SchedulingRulesService = ResourceSearchable<
  typeof SchedulingRulesServiceReadable, SchedulingRuleType, SchedulingRuleSearchParams
>(SchedulingRulesServiceReadable);

export const SchedulingRules = new SchedulingRulesService();
export default SchedulingRules;