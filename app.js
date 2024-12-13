const searchBar = document.querySelector('#buscaFilmes');
const listaDeFilmes = document.querySelector('.container__filmes')
const searchForm = document.querySelector('form');
const txtInputBusca = document.querySelector('#buscaFilmes');
const favoriteOnly = document.querySelector('#apenasFavoritos');

let filmes = [];
let idsFilmesFavoritos = [];
let searchedMovies = [];


const fetchOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYmI2OWM5YzBmZjhjMjI5ZTgzMzI2OTc0OGM0Nzg1YiIsIm5iZiI6MTcwNzE2MjY5OS4zODEsInN1YiI6IjY1YzEzYzRiODFhN2ZjMDE2MWVkNjJlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qQ23tCHVfXZIOszzecIcv3tyMy__oMr7sBuhw-f4fP8'
    }
  };

function inicializar(){
    const fetchUrl = 'https://api.themoviedb.org/3/movie/popular?language=pt-br&page=1';

    fetch(fetchUrl, fetchOptions)
        .then(res => res.json())
        .then(res => mostraListaInicial(res.results))
        .catch(err => console.error(err));
}


inicializar();


async function mostraListaInicial(lista){
    filmes = lista
    renderizaTodos();
}

function adicionaEventosAoFavoritar(){
    document.querySelectorAll('.favoritar').forEach(botao => {
        botao.addEventListener('click', (e)=>{
            if (idsFilmesFavoritos.includes(e.target.dataset.id)){
                idsFilmesFavoritos = idsFilmesFavoritos.filter(function(id){
                    e.target.src = "assets/Heart.png"
                    return id != e.target.dataset.id;
                })
                if (favoriteOnly.checked) {
                    renderizaFavoritos();
                }
            } else {
                idsFilmesFavoritos.push(e.target.dataset.id);
                e.target.src = "assets/Vector.png"
            }
        })
    })
}

function limpaLista() {
    listaDeFilmes.innerHTML = '';
}

function renderizaFavoritos() {
    limpaLista();
    
    let listaFavoritos = filmes.filter(function (filme) {
        return idsFilmesFavoritos.includes(String(filme.id))
    })
    renderiza(listaFavoritos);
}

function renderizaBuscados(buscados) {
    limpaLista();
    renderiza(buscados);
}

function renderizaTodos() {
    limpaLista();
    renderiza(filmes);
}

function renderiza(lista) {
    lista.forEach(filme => {
        listaDeFilmes.innerHTML+=
        `
        <li class="filme" data-id=${filme.id} data-favorito=${idsFilmesFavoritos.includes(filme.id) ? true : false}>
                <div class="filme-meta">
                    <img src="https://image.tmdb.org/t/p/w500/${filme.backdrop_path}" alt="${filme.title}" class="filme-foto">
                    <div class="">
                        <h2 class="filme-nome">${filme.title ? filme.title : "Sem título"}</h2>
                        <div class="filme-meta__icons">
                            <div class="meta-group">
                                <img src="assets/Star.png" alt="avaliação">
                                <span class="filme-meta__nota">${filme.vote_average.toFixed(2)}</span>
                            </div>
                            <div class="meta-group favoritar">
                                <img data-id=${filme.id} src=${idsFilmesFavoritos.includes(String(filme.id)) ? "assets/Vector.png" : "assets/Heart.png"} alt="favoritar">
                                <span class="filme-meta__favoritar">Favoritar</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="filme-descricao">
                ${filme.overview ? filme.overview : "Não foi fornecida descrição para este título."}
                </p>
            </li>
        `
    });
    adicionaEventosAoFavoritar();
}

function fetchBusca(nome) {
      
      fetch(`https://api.themoviedb.org/3/search/movie?query=${nome}&include_adult=false&language=en-US&page=1`, fetchOptions)
        .then(res => res.json())
        .then(res => armazenaBuscados(res.results))
        .catch(err => console.error(err));
}

async function armazenaBuscados(lista) {
    searchedMovies = lista;
    renderizaBuscados(lista);
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let queryParam = txtInputBusca.value;
    fetchBusca(queryParam);

    txtInputBusca.value = '';
})

searchBar.addEventListener('focus', function(){
    searchForm.classList.add('searchBarOn');

})

searchBar.addEventListener('blur', function(){
    searchForm.classList.remove('searchBarOn');
})


// RENDERIZA FAVORITOS OU TODOS DEPENDENDO DO CHECK
favoriteOnly.addEventListener('click', function(){
    if (favoriteOnly.checked){
        renderizaFavoritos();
    } else {
        renderizaTodos();
    }
})