import { IApiGenerator } from './metadata'

enum ESearchOperation {
  EQUAL = '$eq',
}

interface ISearchableProperty {
  fieldName: string
  operator: ESearchOperation
  required: boolean
}

class ListAPIBuilder {
  private name: string
  searchableProps: ISearchableProperty[] = []

  from() {
    return this
  }

  setApiName(name: string) {
    this.name = name
    return this
  }

  add(searchableProp: ISearchableProperty) {
    this.searchableProps.push(searchableProp)
    return this
  }

  build(): IApiGenerator | null {
    return null
  }
}
