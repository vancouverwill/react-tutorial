<?php
$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if($scriptInvokedFromCli) {
    echo 'starting server on port 3000' . PHP_EOL;
    exec('php -S localhost:3000 -t public server.php');
} else {
    return routeRequest();
}

function routeRequest()
{
    $comments = file_get_contents('_comments.json');
    switch($_SERVER["REQUEST_URI"]) {
        case '/':
            echo file_get_contents('./public/index.html');
            break;
        case '/comments.json':
            if($_SERVER['REQUEST_METHOD'] === 'POST') {
                $commentsDecoded = json_decode($comments, true);
                $commentsDecoded[] = ['author'  => $_POST['author'],
                                      'text'    => $_POST['text']];

                $comments = json_encode($commentsDecoded, JSON_PRETTY_PRINT);
                file_put_contents('_comments.json', $comments);
            }
            header('Content-Type: application/json');
            echo $comments;
            break;
        case '/tasks.json':

        $tasks = file_get_contents('_tasks.json');
            if($_SERVER['REQUEST_METHOD'] === 'POST') {
                $tasksDecoded = json_decode($tasks, true);
                $tasksDecoded[] = ['content' => $_POST['content'], 'other' => $_POST['other']];

                $tasks = json_encode($tasksDecoded, JSON_PRETTY_PRINT);

                file_put_contents('_tasks.json', $tasks);
            }
            header('Content-Type: application/json');
            echo $tasks;
            break;
        default:
            return false;
    }
}

