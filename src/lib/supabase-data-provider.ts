import { DataProvider } from 'react-admin'
import { supabase } from './supabase'

const supabaseDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const offset = (page - 1) * perPage

    let query = supabase.from(resource).select('*', { count: 'exact' })

    // Apply filters
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          query = query.eq(key, value)
        }
      })
    }

    // Apply sorting
    query = query.order(field, { ascending: order === 'ASC' })

    // Apply pagination
    query = query.range(offset, offset + perPage - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(error.message)
    }

    return {
      data: data || [],
      total: count || 0,
    }
  },

  getOne: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { data }
  },

  getMany: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .in('id', params.ids)

    if (error) {
      throw new Error(error.message)
    }

    return { data: data || [] }
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const offset = (page - 1) * perPage

    let query = supabase
      .from(resource)
      .select('*', { count: 'exact' })
      .eq(params.target, params.id)

    // Apply filters
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          query = query.eq(key, value)
        }
      })
    }

    // Apply sorting
    query = query.order(field, { ascending: order === 'ASC' })

    // Apply pagination
    query = query.range(offset, offset + perPage - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(error.message)
    }

    return {
      data: data || [],
      total: count || 0,
    }
  },

  create: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .insert(params.data)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { data }
  },

  update: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { data }
  },

  updateMany: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .in('id', params.ids)
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return { data: params.ids }
  },

  delete: async (resource, params) => {
    const { error } = await supabase
      .from(resource)
      .delete()
      .eq('id', params.id)

    if (error) {
      throw new Error(error.message)
    }

    return { data: { id: params.id } }
  },

  deleteMany: async (resource, params) => {
    const { error } = await supabase
      .from(resource)
      .delete()
      .in('id', params.ids)

    if (error) {
      throw new Error(error.message)
    }

    return { data: params.ids }
  },
}

export default supabaseDataProvider