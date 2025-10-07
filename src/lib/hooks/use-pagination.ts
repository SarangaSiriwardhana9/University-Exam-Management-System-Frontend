import { useState, useCallback } from 'react'
import type { PaginationState } from '@tanstack/react-table'

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  }

  const onPaginationChange = useCallback((newState: PaginationState) => {
    setPage(newState.pageIndex + 1)
    setLimit(newState.pageSize)
  }, [])

  return { page, limit, pagination, onPaginationChange }
}