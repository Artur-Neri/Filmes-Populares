const pageButtons = document.querySelectorAll('#page-control button');

let paginaAtual=1;

pageButtons.forEach(page => {
  page.addEventListener('click', function(){
    paginaAtual = this.value;
  })
})

const fetchOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYmI2OWM5YzBmZjhjMjI5ZTgzMzI2OTc0OGM0Nzg1YiIsIm5iZiI6MTcwNzE2MjY5OS4zODEsInN1YiI6IjY1YzEzYzRiODFhN2ZjMDE2MWVkNjJlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qQ23tCHVfXZIOszzecIcv3tyMy__oMr7sBuhw-f4fP8'
    }
};

const fetchUrlInicial = 'https://api.themoviedb.org/3/movie/popular?language=pt-br&page=1';


function changePage(){
  console.log(this.value);
}

