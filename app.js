const searchForm = document.querySelector('form');
const txtInputBusca = document.querySelector('#buscaFilmes');
const favoriteOnly = document.querySelector('#apenasFavoritos');
const searchBar = document.querySelector('#buscaFilmes');
const listaDeFilmes = document.querySelector('.container__filmes');

const fetchUrlInicial = 'https://api.themoviedb.org/3/movie/popular?language=pt-br&page=1';

let idsFilmesFavoritos = [];
let ultimosMostrados = [];
let listaAtual = [];

const fetchOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYmI2OWM5YzBmZjhjMjI5ZTgzMzI2OTc0OGM0Nzg1YiIsIm5iZiI6MTcwNzE2MjY5OS4zODEsInN1YiI6IjY1YzEzYzRiODFhN2ZjMDE2MWVkNjJlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qQ23tCHVfXZIOszzecIcv3tyMy__oMr7sBuhw-f4fP8'
    }
};

function inicializar(){
    // idsFilmesFavoritos = JSON.parse(localStorage.getItem("idsFilmesFavoritos"));
    console.log(idsFilmesFavoritos);
    fetch(fetchUrlInicial, fetchOptions)
        .then(res => res.json())
        .then(res => renderiza(res.results))
        .catch(err => console.error(err));
}

inicializar();

function renderiza(lista) {
    limpaLista();
    listaAtual = lista;
    lista.forEach(filme => {
        listaDeFilmes.innerHTML+=
        `
        <li class="filme" data-id=${filme.id} data-favorito=${idsFilmesFavoritos.includes(filme.id) ? true : false}>
                <div class="filme-meta">
                    <img src="https://image.tmdb.org/t/p/w500/${filme.backdrop_path}" alt="${filme.title}" class="filme-foto" onerror="this.onerror=null; this.src='https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'">
                    <div class="">
                        <h2 class="filme-nome">${filme.title ? filme.title : "Sem título"}</h2>
                        <div class="filme-meta__icons">
                            <div class="meta-group">
                                <img src="assets/Star.png" alt="avaliação">
                                <span class="filme-meta__nota">${filme.vote_average ? filme.vote_average.toFixed(2) : 'N/A'}</span>
                            </div>
                            <div class="meta-group favoritar">
                                <img class="favoritar-icon" data-id=${filme.id} src=${idsFilmesFavoritos.includes(String(filme.id)) ? "assets/Vector.png" : "assets/Heart.png"} alt="favoritar">
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


// SEMPRE QUE RENDERIZAR, CHAMAR ESSA FUNÇÃO
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
                e.target.src = "assets/Vector.png";
            }
            // SALVA A NOVA LISTA DE IDS NO LOCALSTORAGE
            // localStorage.setItem("idsFilmesFavoritos",JSON.stringify(idsFilmesFavoritos))
            // console.log(localStorage);

        })
    })
}
// ANTES DE RENDERIZAR, CHAMAR ESSA FUNÇÃO
function limpaLista() {
    listaDeFilmes.innerHTML = '';
}

async function buscaFilmePorId(id) {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?language=pt-BR`, fetchOptions)
        .then(res => res.json())
        .then(res => {return res})
        .catch(err => console.error(err));
}


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

        let queryParam = txtInputBusca.value;
        fetchBusca(queryParam);
    
        txtInputBusca.value = '';
    }
)

searchBar.addEventListener('focus', function(){
    searchForm.classList.add('searchBarOn');

})

searchBar.addEventListener('blur', function(){
    searchForm.classList.remove('searchBarOn');
})


async function renderizaFavoritos() {
    limpaLista();
    
    let listaFavoritos = await Promise.all(
        idsFilmesFavoritos.map(id => buscaFilmePorId(parseInt(id)))
    )

    renderiza(listaFavoritos);
}

// function renderizaBuscados(buscados) {
//     limpaLista();
//     renderiza(buscados);
// }

// function renderizaTodos() {
//     limpaLista();
//     renderiza(filmes);
// }

// function renderiza(lista) {
//     lista.forEach(filme => {
//         listaDeFilmes.innerHTML+=
//         `
//         <li class="filme" data-id=${filme.id} data-favorito=${idsFilmesFavoritos.includes(filme.id) ? true : false}>
//                 <div class="filme-meta">
//                     <img src="https://image.tmdb.org/t/p/w500/${filme.backdrop_path}" alt="${filme.title}" class="filme-foto">
//                     <div class="">
//                         <h2 class="filme-nome">${filme.title ? filme.title : "Sem título"}</h2>
//                         <div class="filme-meta__icons">
//                             <div class="meta-group">
//                                 <img src="assets/Star.png" alt="avaliação">
//                                 <span class="filme-meta__nota">${filme.vote_average.toFixed(2)}</span>
//                             </div>
//                             <div class="meta-group favoritar">
//                                 <img data-id=${filme.id} src=${idsFilmesFavoritos.includes(String(filme.id)) ? "assets/Vector.png" : "assets/Heart.png"} alt="favoritar">
//                                 <span class="filme-meta__favoritar">Favoritar</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <p class="filme-descricao">
//                 ${filme.overview ? filme.overview : "Não foi fornecida descrição para este título."}
//                 </p>
//             </li>
//         `
//     });
//     adicionaEventosAoFavoritar();
// }

function fetchBusca(nome) {
      if(nome){
          fetch(`https://api.themoviedb.org/3/search/movie?query=${nome}&include_adult=false&language=en-US&page=1`, fetchOptions)
            .then(res => res.json())
            .then(res => renderiza(res.results))
            .catch(err => console.error(err));
      }
      else {
        ;
      }
}

// RENDERIZA FAVORITOS OU TODOS DEPENDENDO DO CHECK
favoriteOnly.addEventListener('click', function(){
    if (favoriteOnly.checked){
        ultimosMostrados = listaAtual;
        renderizaFavoritos();
    } else {
        renderiza(ultimosMostrados);
    }
})