<?php
// d9416fc65dae6717c665c2db49b1580e

// Secret:
// 472cc1aaf8a2a2bb

$tag = "rabbit";
$url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=4b131cfca539bd6b4ea5252f067c1bbe&tags=".$tag."&format=json&nojsoncallback=1'
$data = json_decode(file_get_contents($url));
$photos=$data->photos->photo
foreach($photos as $photo) {
    echo '<h1>'.$photo->title
}