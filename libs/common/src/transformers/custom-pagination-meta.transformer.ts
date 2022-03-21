/**
 * public readonly item_count: number => itemCount
 * public readonly total_pages: number => totalPages
 */
export class CustomPaginationMetaTransformer {
  constructor(
    public readonly total: number,
    public readonly size: number,
    public readonly page: number,
  ) {}
}
