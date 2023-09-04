

const key = "7cece26d8ce488cde46be418d8c863c6"

function colocarDadosNaTela(dados) {
    document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name
    document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C"
    document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description
    document.querySelector(".umidade").innerHTML = "Umidade " + dados.main.humidity + "%"
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`

}

async function buscarCidade(cidade) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`).then(resposta => resposta.json())
    
    console.info(dados);
    
    colocarDadosNaTela(dados)
}

function cliqueNoBotao() {
    const cidade = document.querySelector(".input-cidade").value

    buscarCidade(cidade)
}

document.addEventListener('DOMContentLoaded', function(){
    const inputElement = document.getElementById('dados');

    const awesomplete = new awesomplete(inputElement,{
        minChars:2, //Numero mínimo de caracteres para começar a exibir sugestões
        maxItems:10, //Número máximo de itens exibidos na lista de sugestões
        filter:function(text,input){
            return awesomplete.FILTER.CONTAINS(text, input.match(/[^,]*$/)[0]);
        },
        replace: function(selected){
            const val = inputElement.value;
            const before = val.match (/^.+,\s*|/)[0];
            inputElement.value = before + selected.label + ',';
        },

    });

    inputElement.addEventListener('input',function(){
        const inputValue = inputElement.value.trim();

        if (inputValue.length >=2){
            fetch(`https://api.openweathermap.org/data/2.5/find?q=${inputValue}&type=like&appid=${key}`)
                .then(response => response.json())
                .then(data=>{
                    const citySuggestions = data.list.map(city => ({
                        label: `${cidade.nome}, ${city.sys.country}`,
                        value: cidade.nome,
                    }));
                    awesomplete.list = citySuggestions;
                })
                .catch(error =>{
                    console.error('Erro ao buscar sugestões de cidades:', error);
                });
        }else{
            awesomplete.list =[];
        }
    });
});