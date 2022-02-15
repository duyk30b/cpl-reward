export class CustomPaginationMetaTransformer {
  constructor(
    public readonly total_items: number,
    public readonly item_count: number,
    public readonly items_per_page: number,
    public readonly total_pages: number,
    public readonly current_page: number,
  ) {}
}
