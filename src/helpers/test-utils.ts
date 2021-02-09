export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = filename.includes('src') ? 'src' : 'dist'
    const startIndex = filename.indexOf(skipText) + skipText.length + 1
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }
}

export class Value {
  static NO_MATTER(_name?: string): any {
    return Math.random()
  }

  static SOME_STRING(_name?: string): string {
    return String(Math.random())
  }

  static NO_MATTER_OBJECT(_name?: string): any {
    return {}
  }

  static SOME_VALUE(_name?: string): any {
    return Math.random()
  }

  static SOME_NUMBER(_name?: string): any {
    return Math.random()
  }

  static SOME_OBJECT(_name?: string): any {
    return { data: Math.random() }
  }

  static wrap(input: any): any {
    return input
  }

  static EMPTY_ARRAY(_name?: string): any[] {
    return []
  }
}
