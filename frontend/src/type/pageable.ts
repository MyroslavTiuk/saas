import { LIMIT_AT_ONCE } from 'src/utils/const';
import { OrderByCondition } from 'typeorm';

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Sort {
  order: SortType;
  field: string;
}

// page start from 1.
export class Pageable {
  size?: number;
  page?: number;
  sort?: Sort[];

  constructor(size?: number, page?: number, sort?: Sort[]) {
    this.size = Number(size) || LIMIT_AT_ONCE;
    this.page = Number(page) || 1;
    this.sort = sort || [];
  }

  set setSort(sort: Sort[] | Sort) {
    if (Array.isArray(sort)) {
      this.sort.concat(sort);
      return;
    }
    this.sort.push(sort);
  }

  get limit() {
    return this.size || LIMIT_AT_ONCE;
  }

  get offset() {
    return (this.page - 1) * this.size || 0;
  }

  get lastOffset() {
    return this.page * this.size;
  }

  getTotalPage(totalCount: number | undefined) {
    return totalCount ? Math.ceil(totalCount / this.size) : 1;
  }

  getOrderByCondition(tableName: string) {
    return this.sort.reduce((o, v) => {
      o[`${tableName}.${v.field}`] = v.order;
      return o;
    }, {} as OrderByCondition);
  }
}
