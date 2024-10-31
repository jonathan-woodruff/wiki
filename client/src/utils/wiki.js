export const goToWiki = (wikiID) => {
    const params = new URLSearchParams();
    params.append('wiki', wikiID);
    const queryString = params.toString();
    const url = `./wiki.html?${queryString}`;
    window.location.href = url;
};

export const showPreview = (contentBlocks) => {
    const previewLimit = 100;
    let preview = '';
    let reachedPreviewLimit = false;
    let blockIndex = 0;
    while (!reachedPreviewLimit && blockIndex < contentBlocks.length) {
      let block = contentBlocks[blockIndex];
      if (block.type === 'paragraph' || block.type === 'header' || block.type === 'quote') {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.innerHTML = block.data.text;
        let textToAdd = wrapperDiv.textContent || wrapperDiv.innerText || block.data.text;
        preview += textToAdd + ' ';
      } else if (block.type === 'list') {
        block.data.items.forEach((item) => {
          let wrapperDiv = document.createElement('div');
          wrapperDiv.innerHTML = item.content;
          let textToAdd = wrapperDiv.textContent || wrapperDiv.innerText || item.content;
          preview += textToAdd + ' ';
        })
      }
      if (preview.length > previewLimit) {
        preview = preview.slice(0, previewLimit);
        reachedPreviewLimit = true;
      }
      blockIndex++;
    }
    preview = preview.trimEnd();
    return preview + '...';
};