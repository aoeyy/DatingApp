export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

//T represents an array of members
export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}