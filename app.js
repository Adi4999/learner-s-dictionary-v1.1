let input = document.querySelector('#input');
let btn = document.querySelector('#Search');
let apiKey = '5b393ae0-8d85-43d1-8956-123765eb092e';
let notFound = document.querySelector('.not_found ');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let darkBtn = document.querySelector('.dmode');

let color = 1;
//1 = in present light mode
//2=in present dark mode

btn.addEventListener('click', function (e) {
  e.preventDefault();
  audioBox.innerHTML = '';
  notFound.innerHTML = '';
  defBox.innerHTML = '';
  let word = input.value;
  if (word === '') {
    alert('Enter a word...');
    return;
  }
  if (word.includes(' ')) {
    alert('Search for one word at a time');
    return;
  }
  getData(word);
});

input.addEventListener('keydown', function (e) {
  if (e.key == 'Enter') {
    e.preventDefault();
    audioBox.innerHTML = '';
    notFound.innerHTML = '';
    defBox.innerHTML = '';
    let word = input.value;
    if (word === '') {
      alert('Enter a word...');
      return;
    }
    if (word.includes(' ')) {
      alert('Search for one word at a time');
      return;
    }
    getData(word);
  }
});

async function getData(word) {
  loading.style.display = 'block';
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  const data = await response.json();
  console.log(data);
  if (!data.length) {
    loading.style.display = 'none';
    notFound.textContent = 'No result found  :/';
    return;
  }
  if (typeof data[0] === 'string') {
    loading.style.display = 'none';

    let heading = document.createElement('h3');
    //
    let sugg = document.createElement('div');
    sugg.classList.add('sugg');
    //
    heading.textContent = 'Did you mean ?';

    notFound.appendChild(heading);
    //
    notFound.appendChild(sugg);
    //
    data.forEach(element => {
      let suggestion = document.createElement('span');
      suggestion.classList.add('suggested');
      suggestion.textContent = element;
      sugg.appendChild(suggestion);
    });
    //
    let all = document.querySelectorAll('.suggested');
    console.log(all);

    for (let i = 0; i < all.length; i++) {
      all[i].addEventListener('click', function () {
        audioBox.innerHTML = '';
        notFound.innerHTML = '';
        defBox.innerHTML = '';

        word = all[i].textContent;
        input.value = word;
        getData(word);
      });
    }

    //
    return;
  }
  loading.style.display = 'none';
  let defination = data[0].shortdef[0];
  defBox.innerHTML = `<strong>Definition</strong> : ${defination}.`;
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    renderSound(soundName);
  }

  //console.log(data);
}

function renderSound(soundName) {
  //https://media.merriam-webster.com/soundc11
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;
  let aud = document.createElement('audio');
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}

darkBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (color == 1) {
    document.querySelector('html').style.color = 'white';
    document.querySelector('body').style.backgroundColor = '#292f33';
    document.querySelector('input').style.backgroundColor = '#32373d';
    document.querySelector('input').style.color = 'white';
    document.querySelector('.input_wrap').style.border = '1px solid #808181';
    document.querySelector('#changeM').textContent = 'Light';
    defBox.style.color = 'white';
    document.querySelector('.dmode').style.color = '#0163ff';
    document.querySelector('.dmode').style.backgroundColor = '#fff';

    color = 2;
  } else if (color == 2) {
    document.querySelector('html').style.color = 'black';
    document.querySelector('body').style.backgroundColor = '#fff';
    document.querySelector('input').style.backgroundColor = '#fff';
    document.querySelector('input').style.color = 'black';
    document.querySelector('.input_wrap').style.border = '1px solid #ddd';
    document.querySelector('#changeM').textContent = 'Dark';
    defBox.style.color = 'black';
    document.querySelector('.dmode').style.color = '#c1c3c4';
    document.querySelector('.dmode').style.backgroundColor = '#292f33';

    color = 1;
  }
});
