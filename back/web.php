<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::group([
    'middleware' => ['cors'],
], function ($router) {
        Route::get('/notes', 'IndexController@getNotes');
        Route::get('/addNote', 'IndexController@addNote');
        Route::get('/deleteNote/{noteId}', 'IndexController@destroy');
        Route::get('/editNote/{noteId}', 'IndexController@edit');

        Route::get('/switchTag/{noteId}', 'IndexController@switchTag'); 


});