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

export class ButtonImage {
  constructor({data, api}){
    this.data = {
      url: data.url || '',
      withBorder: data.withBorder !== undefined ? data.withBorder : false,
      withBackground: data.withBackground !== undefined ? data.withBackground : false,
      stretched: data.stretched !== undefined ? data.stretched : false,
    };
    this.api = api;
    this.wrapper = undefined;
    this.settings = [
      {
        name: 'withBorder',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
      },
      {
        name: 'stretched',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
      },
      {
        name: 'withBackground',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
      }
    ];
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-image" viewBox="0 0 20 20">
      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
    </svg>`
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  renderSettings() {
    const wrapper = document.createElement('div');

    this.settings.forEach( tune => {
      let button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      button.classList.add('w-100');
      button.classList.add('justify-content-start');
      button.classList.toggle('cdx-settings-button--active', this.data[tune.name]);
      let helperText = tune.name === 'withBorder' ? '\xa0\xa0Add Border' : tune.name === 'stretched' ? '\xa0\xa0Stretch Image' : '\xa0\xa0Add Background';
      button.innerHTML = tune.icon + helperText;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this._toggleTune(tune.name);
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }

  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  _acceptTuneView() {
    this.settings.forEach( tune => {
      this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
        this._styleImage(tune.name, !!this.data[tune.name]);
    });
  }

  _styleImage(tune, isActive) {
    if (tune === 'withBackground' && isActive) {
      this.wrapper.style.background = '#eff2f5';
      this.wrapper.style.padding = '10px';
      this.wrapper.firstChild.style.display = 'block';
      this.wrapper.firstChild.style.maxWidth = '60%';
      this.wrapper.firstChild.style.margin = '0 auto 15px';
    } else if (tune === 'withBackground') { //not active
      this.wrapper.style.background = '#fff';
      this.wrapper.style.padding = '0';
      this.wrapper.firstChild.style.display = '';
      this.wrapper.firstChild.style.maxWidth = '100%';
      this.wrapper.firstChild.style.margin = '';
    } else if (tune === 'withBorder' && isActive) {
      this.wrapper.style.border = '1px solid #e8e8eb';
    } else if (tune === 'withBorder') { //not active
      this.wrapper.style.border = '';
    } else if (tune === 'stretched' && isActive) {
      this.wrapper.firstChild.style.maxWidth = 'none';
      this.wrapper.firstChild.style.width = '100%';
    } else if (tune === 'stretched') { //not active
      this.wrapper.firstChild.style.maxWidth = '100%';
      this.wrapper.firstChild.style.width = 'auto';
    }
  }

  render() {
    this.wrapper = document.createElement('div');
    const userImg = document.createElement('img');
    userImg.style.maxWidth = '100%';
    this.wrapper.appendChild(userImg);
    this.wrapper.classList.add('button-image');
    if (this.data && this.data.url) {
      userImg.src = this.data.url;
      this._acceptTuneView();
      return this.wrapper;
    }
    let newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.accept = 'image/*';
    newInput.classList.add('invisible');
    newInput.addEventListener('input', (event) => {
      const file = event.currentTarget.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (onloadEvent) => {
          userImg.src = onloadEvent.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    newInput.click();
    return this.wrapper;
  }

  save(blockContent) {
    return Object.assign(this.data, {
      url: blockContent.firstChild.src,
      withBorder: !!this.data.withBorder,
      withBackground: !!this.data.withBackground,
      stretched: !!this.data.stretched,
    })
  }
}