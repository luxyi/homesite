<?php

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        get();
        break;
    case 'POST':
        post();
        break;
    case 'DELETE':
        delete();
        break;
    default:
        break;
}

function get() {
    $db = new SQLite3('elec.sqlite3');
    $result = $db->query('SELECT [id], [bill_date], [peak_time_power], [valley_time_power], [peak_time_price], [valley_time_price], [price] FROM [bills] ORDER BY [bill_date] DESC');
    $objs = array();
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $objs[] = $row;
    }
    echo json_encode($objs);
}

function post() {
    $sql = 'INSERT INTO [bills] ([bill_date], [peak_time_power], [valley_time_power], [peak_time_price], [valley_time_price], [price]) VALUES (:bill_date, :peak_time_power, :valley_time_power, :peak_time_price, :valley_time_price, :price)';
    $db = new SQLite3('elec.sqlite3');
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':bill_date', $_POST['bill-date'], SQLITE3_TEXT);
    $stmt->bindValue(':peak_time_power', $_POST['peak-time-power'], SQLITE3_INTEGER);
    $stmt->bindValue(':valley_time_power', $_POST['valley-time-power'], SQLITE3_INTEGER);
    $stmt->bindValue(':peak_time_price', $_POST['peak-time-price'], SQLITE3_TEXT);
    $stmt->bindValue(':valley_time_price', $_POST['valley-time-price'], SQLITE3_TEXT);
    $stmt->bindValue(':price', $_POST['price'], SQLITE3_TEXT);
    $result = $stmt->execute();

    header("Location: elec.html");
    exit;
}

function delete() {
//    error_log(print_r($_GET['id'], TRUE));
    $sql = 'DELETE FROM [bills] WHERE [id] = :id';
    $db = new SQLite3('elec.sqlite3');
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':id', $_GET['id'], SQLITE3_INTEGER);
    $result = $stmt->execute();
}
