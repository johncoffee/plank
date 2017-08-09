var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function saveContent(space) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const space = await client.getSpace(SPACE_ID)
            let contentTypes = yield space.getContentTypes();
            console.log(contentTypes);
            const draftEntry = yield space.createEntry('exercise', {
                fields: {
                    name: {
                        'da-DK': 'Test new entry',
                    },
                    duration: {
                        'da-DK': 2,
                    },
                },
            });
            console.log(draftEntry);
            const published = yield draftEntry.publish();
        }
        catch (e) {
            console.log(e);
        }
    });
}
