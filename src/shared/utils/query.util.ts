import { ESortMode, IListRequestQuery } from '../types/query.type';

export const parseQuery = <T>(
  query: T & IListRequestQuery,
): {
  limit: number;
  offset: number;
  order: { [key: string]: ESortMode };
  page: number;
} => {
  const limit = query.filters.pagination?.limit || 25;
  const page = query.filters.pagination?.page || 1;

  const offset = limit * (page - 1);
  const order = {
    [query.filters.sort?.by || 'createdAt']:
      query.filters.sort?.mode || ESortMode.DESC,
  };

  return {
    limit: Number(limit),
    offset: Number(offset),
    order,
    page: Number(page),
  };
};

export const parseMeta = <T>({
  result,
  total,
  limit,
  page,
}: {
  result: T[];
  total: number;
  limit: number;
  page: number;
}) => ({
  count: result.length,
  total,
  page,
  totalPage: Math.ceil(total / limit),
});
