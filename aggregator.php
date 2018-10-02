<?php
// This file looks for post data and if it exists, redirects to the angular page while inserting data into the url.
// If no post data exists (OR somebody goes to this page directly), we shove them off to the root path.
if (empty($_POST)) {
  header('Location: '.$_SERVER['REQUEST_URI']);
} else {
  echo "<script>window.location.replace('". $_SERVER['REQUEST_URI'].'/aggregator?'.http_build_query($_POST) ."');</script>";
}
?>
