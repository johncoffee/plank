
async function saveContent (space:any):Promise<any> {

  try {
    // const space = await client.getSpace(SPACE_ID)
    let contentTypes = await space.getContentTypes()
    console.log(contentTypes)

    const draftEntry = await space.createEntry('exercise', {
      fields: {
        name: {
          'da-DK': 'Test new entry',
        },
        duration: {
          'da-DK': 2,
        },
      },
    })

    console.log(draftEntry)

    const published = await draftEntry.publish()
  }
  catch (e) {
    console.log(e)
  }
}
