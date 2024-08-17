<?php
// logout.php
session_start();
session_destroy();
echo "Logout successful";
exit()
?>
