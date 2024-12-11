const searchBar = document.querySelector('#buscaFilmes');
const searchForm = document.querySelector('form');

searchBar.addEventListener('focus', function(){
    searchForm.classList.add('searchBarOn');

})

searchBar.addEventListener('blur', function(){
    searchForm.classList.remove('searchBarOn');
})

