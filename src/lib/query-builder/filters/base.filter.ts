import type { FindOperator, FindOptionsWhere } from 'typeorm';

export abstract class QueryBuilderFilter {
  public readonly alias: string;

  constructor(public readonly nameOrAlias: string) {
    this.alias = nameOrAlias;
  }

  abstract build(
    value: unknown,
  ): string | FindOperator<unknown> | FindOptionsWhere<unknown>;
}
