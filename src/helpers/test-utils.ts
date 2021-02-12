export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = 'src'
    const startIndex = filename.indexOf(skipText) + skipText.length + 1
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }

  static NO_MATTER_VALUE(_name?: string): any {
    return Math.random()
  }
}
