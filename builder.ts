interface Activity {
  duration: number,
  name: string,
  onEnd?: Function,
  onStart?: Function,
}

class Builder {
  public static STORAGE_KEY = 'An2g03gud01g-hhj5'
  private loaded:boolean = false

  fetchData():Activity[] {
    let result:Activity[] = []
    try {
      result = JSON.parse(localStorage[Builder.STORAGE_KEY])
    }
    catch (e) {
      console.error(e.message)
      localStorage[Builder.STORAGE_KEY] = ''
    }
    return result
  }

  persistData(value:Activity[]) {
    if (!value)
      throw "No value to store"

    localStorage[Builder.STORAGE_KEY] = JSON.stringify(value)
  }
}