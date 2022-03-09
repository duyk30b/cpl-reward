export class CustomPaginationMetaTransformer {
  constructor(
    public readonly total: number,
    public readonly size: number,
    public readonly page: number,
    public readonly item_count: number,
    public readonly total_pages: number,
  ) {}
}

export class CustomPaginationMetaCamelTransformer {
  constructor(
    public readonly total: number,
    public readonly size: number,
    public readonly page: number,
    public readonly itemCount: number,
    public readonly totalPages: number,
  ) {}
}
