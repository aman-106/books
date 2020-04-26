
class ChapterList {
  constructor() {
    this.chapterContainer = document.querySelector('.chapters-list');
    this.booksOverViewContainer = document.querySelector('.books-overview');
    this.currentChapter = '';
    this.updateShowChapter = this.updateShowChapter.bind(this);
  }

  updateShowChapter(currentChapter) {
    const sections = document.querySelectorAll(`[class^="chapters-list__item__section"]`);
    for (const section of sections) {
      const chapterID = section.getAttribute('data-id');
      section.className = `chapters-list__item__section${currentChapter == chapterID ? '--open' : '--close'}`;
    }
  }


  renderList(chapterList) {
    chapterList = chapterList.sort(function (bookA, bookB) { return bookA.sequenceNO - bookB.sequenceNO });
    for (const chapter of chapterList) {
      const chapterElem = document.createElement('div');
      const clsx = chapter.completeCount === chapter.childrenCount ? 'chapters-list__item--completed' : 'chapters-list__item';
      chapterElem.className = clsx;
      chapterElem.setAttribute('data-id', chapter.id);
      chapterElem.getAttribute

      const chapterTitle = document.createElement('div');
      chapterTitle.innerText = chapter.title;
      chapterTitle.className = 'chapters-list__item__title';

      const sectionInfo = document.createElement('div');
      sectionInfo.className = 'chapters-list__item__section--close';
      sectionInfo.setAttribute('data-id', chapter.id);

      // sectionInfo.className = `chapters-list__item__section ${this.currentChapter == chapter.id ? 'chapters-list__item__section--open' : 'chapters-list__item__section--close'}`;
      chapterElem.appendChild(chapterTitle)
      chapterElem.appendChild(sectionInfo)
      this.chapterContainer.append(chapterElem);
      chapterElem.addEventListener('click', (event) => {
        // debugger;
        const chapterID = event.currentTarget.getAttribute('data-id');
        getSectionDetails(chapterID, sectionInfo);
        // this.currentChapter = chapterID;
      });
    }
    this.booksOverViewContainer.appendChild(this.chapterContainer);
  }
}

class SectionInfo {
  render(sectionsInfo, sectionInfoContainer) {
    sectionsInfo = sectionsInfo.sort(function (chapA, chapB) { return chapA.sequenceNO - chapB.sequenceNO });
    for (const section of sectionsInfo) {
      const sectionELem = document.createElement('div');
      let className = 'section-info ';
      if (section.status === 'IN_PROGRESS') {
        className += ' in-progess'
      }
      else if (section.status === 'NOT_STARTED') {
        className += 'not-started'
      } else {
        className += 'complete';
      }
      sectionELem.className = className;
      sectionELem.innerText = section.title;
      sectionInfoContainer.appendChild(sectionELem);
    }
  }
}


const chapterList = new ChapterList();
const section = new SectionInfo();
const emptyList = []

window.addEventListener('load', function () {
  console.log('load');
  fetch('/api/book/maths', { method: 'GET' }).
    then(res => res.json()).
    then(function (res) {
      if (res.statusCode == '200') {
        chapterList.renderList(res.response);
      } else {
        chapterList.renderList(emptyList);
      }
    })
});


function getSectionDetails(sectionid, sectionInfoContainer) {
  fetch(`/api/book/maths/section/${sectionid} `, { method: 'GET' }).
    then(res => res.json()).
    then(function (res) {
      if (res.statusCode == '200') {
        section.render(res.response[sectionid], sectionInfoContainer);
        chapterList.updateShowChapter(sectionid);
      } else {
        section.render(emptyList, sectionInfoContainer);
        chapterList.updateShowChapter(sectionid);
      }
    })
}
