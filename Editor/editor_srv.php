<?php


if ($_GET['d'] == 'load') {
    if (is_file($_GET['path'] . '.html')) echo implode('', file($_GET['path'] . '.html'));
    else echo 'error path';
}


if ($_GET['d'] == 'crt') {
    if (!is_file($_GET['path'])) {
        $f = fopen($_GET['path'] . '.html', 'w');
        fwrite($f, '<head><meta charset="UTF-8"></head>
<script src="MGMQ.js"></script>
<script>
const MQ = new MGMQ()
MQ.text = `
>name '. $_GET['path'] .'
>back rgb(50, 60, 70)
>text rgb(200, 200, 200)
>filter brightness(80%) contrast(5) grayscale(100%)


`
</script>
');
    }
}

if ($_GET['d'] == 'save' && is_file($_GET['path'] . '.html')) {
    $_GET['path'] = str_replace('..', '', $_GET['path']);
    $f = fopen($_GET['path'] . '.html', 'w');
    fwrite($f, $_POST['text']);
    fclose($f);
    echo 'save ok';
}


if ($_GET['d'] == 'list') {
    $d = scandir('.');
    $ot = array();
    foreach($d as $v) if (stristr($v, '.html') != '' && $v != 'editor.html' && $v != 'list.html') $ot[] = str_replace('.html', '', $v);
    echo json_encode($ot);
}



?>