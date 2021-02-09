export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = filename.includes('src') ? 'src' : 'dist'
    const startIndex = filename.indexOf(skipText) + skipText.length + 1
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }

  static NO_MATTER_VALUE(_name?: string): any {
    return Math.random()
  }
}
