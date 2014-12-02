// esconde e mostra controles

function AtualizaControles() {
    if ($("#selectModoCaixa").val == '0') {
        ExibirInfosManual(false);
        ExibirInfosAuto(false);
        ExibirInfosInt(false);
        MostrarLotesCaixa(false);
        MostrarMsgErro(false);
    }
    if ($("#selectModoCaixa").val == '1') {
        ExibirInfosInt(false);
        ExibirInfosManual(false);
        ExibirInfosAuto(true);
        MostrarLotesCaixa(true);
    }
    if ($("#selectModoCaixa").val == '2') {

        ExibirInfosAuto(false);
        ExibirInfosManual(false);
        ExibirInfosInt(true);
        MostrarLotesCaixa(true);
        MostrarMsgErro(false);
    }
    if ($("#selectModoCaixa").val == '3') {
        ExibirInfosAuto(false);
        ExibirInfosInt(false);
        ExibirInfosManual(true);
        MostrarLotesCaixa(true);
        MostrarMsgErro(false);
    }
}

function ExibirInfosManual(exibir) {
    if (exibir == true) {
        $('#lblCaixaInfoManual').show('fast');
        $('#lblConfirmacaoCaixa').show('fast');
        $('#txtCaixaInfoManual').show('fast');
    }
    else {
        $('#lblCaixaInfoManual').hide('fast');
        $('#lblConfirmacaoCaixa').hide('fast');
        $('#lblConfirmacaoCaixa').val('');
        $('#txtCaixaInfoManual').hide('fast');
    }
}

function ExibirInfosAuto(exibir) {
    if (exibir == true) {
        $('#lblCaixaAuto').show('fast');
        $('#txtCaixaAuto').show('fast');
    }
    else {
        $('#lblCaixaAuto').hide('fast');
        $('#txtCaixaAuto').hide('fast');
    }
}

function MostrarLotesCaixa(exibir) {
    if (exibir == true) {
        $('#divLote').show('fast');
    }
    else {
        $('#divLote').hide('fast');
    }
}

function MostrarMsgErro(exibir) {
    if (exibir == true) {
        $('#divMsgErro').show('fast');
    }
    else {
        $('#divMsgErro').hide('fast');
    }
}

function ExibirInfosInt(exibir) {
    if (exibir == true) {
        $('#lblCaixaInt').show('fast');
        $('#selCaixaInt').show('fast');
    }
    else {
        $('#lblCaixaInt').hide('fast');
        $('#selCaixaInt').hide('fast');
    }
}

function IniciaCursor() {
    $("body").css("cursor", "progress");
}

function FimCursor() {
    $("body").css("cursor", "defaulr");
}

function EsconderMensagemErro() {
    $('#divWarning').hide('fast');
}

function ExibirMensagemErro(titulo, mensagem) {
    $("#divWarning").show('fast');
    $('#divCorpoErroMessage').html(mensagem);
    $('#spanTituloErro').html(titulo);
    if (mensagem == '') {
        $('#btnDetalhesErro').hide('fast');
    }
    else {
        $('#btnDetalhesErro').show('fast');
    }
}

function ObtemNumeroCaixa() {
    if ($('#selectModoCaixa').val() == '2') { return $('#selCaixaInt').val(); }
    if ($('#selectModoCaixa').val() == '3') { return $('#txtCaixaInfoManual').val(); }
    return '';
}

function ObterNumeroLote() { return $('#selLote').val(); }

function LimparCodigoBarrasCaixa() {
    $('#btnBarcodeCaixa').hide('fast');
    $('#txtCodigoBarrasCaixa').val('');
    $('#lblCodigoBarrasCaixa').hide('fast');
    LimparCodigoBarrasLote();
}

function LimparCodigoBarrasLote() {
    $('#btnBarcodeLote').hide('fast');
    $('#txtCodigoBarrasLote').val('');
    $('#lblCodigoBarrasLote').hide('fast');
}

$(".clsCPF").mask("999.999.999-99", { placeholder: "CPF" });
$(".clsCNPJ").mask("99.999.999/9999-99", { placeholder: "CNPJ" });
$(".primeiroDescritor").mask("99.999.999/9999-99", { placeholder: "first" });

// testes mascara
function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

function cpf_mask(v) {
    v = v.replace(/\D/g, "")                 //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2")    //Coloca ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2")    //Coloca ponto entre o setimo e o oitava dígitos
    v = v.replace(/(\d{3})(\d)/, "$1-$2")   //Coloca ponto entre o decimoprimeiro e o decimosegundo dígitos
    return v
}
function cnpj_mask(v) {
    v = v.replace(/\D/g, "")                           //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, "$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
    return v
}

function formatar(mascara, documento) {
    alert('Teste');
    var i = documento.value.length;
    var saida = mascara.substring(0, 1);
    var texto = mascara.substring(i)

    if (texto.substring(0, 1) != saida) {
        documentos += texto.substring(0, 1);
    }
}
// fim testes mascara