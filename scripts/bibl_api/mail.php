<?php
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Import PHPMailer classes into the global namespace 
use PHPMailer\PHPMailer\PHPMailer; 
use PHPMailer\PHPMailer\SMTP; 
use PHPMailer\PHPMailer\Exception; 
 
// // Include library files 
require 'vendor/phpmailer/phpmailer/src/Exception.php'; 
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php'; 
require 'vendor/phpmailer/phpmailer/src/SMTP.php'; 


// // Create an instance; Pass `true` to enable exceptions 
$mail = new PHPMailer; 

//echo 'mail class';
// Server settings 
//$mail->SMTPDebug = SMTP::DEBUG_SERVER;    //Enable verbose debug output 
$mail->isSMTP();                            // Set mailer to use SMTP 
$mail->Host = 'smtp.gmail.com';           // Specify main and backup SMTP servers 
$mail->SMTPAuth = true;                     // Enable SMTP authentication 
$mail->Username = 'imranasifquaidian@gmail.com';       // SMTP username 
$mail->Password = 'crkhrgqpdrnwmmoa';         // SMTP password 
$mail->SMTPSecure = 'ssl';                  // Enable TLS encryption, `ssl` also accepted 
$mail->Port = 465;                          // TCP port to connect to 

//echo 'Set Mailer';
// Sender info
$mail->setFrom('fair@classic.ox.ac.uk', 'Fair Epigraphic Bibliography'); 
//$mail->addReplyTo('reply@example.com', 'SenderName'); 

//SendEmail('sheikhimranasif@gmail.com', 'password 123');
function SendEmail($email, $password)
{
    global $mail;
    // Add a recipient 
    $mail->addAddress($email); 
    
    //$mail->addCC('cc@example.com'); 
    //$mail->addBCC('bcc@example.com'); 
    
    // Set email format to HTML 
    $mail->isHTML(true); 
    
    // Mail subject 
    $mail->Subject = 'FAIR Epigraphic Bibliography user info'; 
    
    // Mail body content 
    $bodyContent = "Your password is <b>$password</b>"; 
    //$bodyContent .= '<p>This HTML email is sent from the localhost server using PHP by <b>CodexWorld</b></p>'; 
    $mail->Body    = $bodyContent; 
    
    // Send email 
    if(!$mail->send()) { 
        return 'Error: Message could not be sent. Mailer Error: '.$mail->ErrorInfo; 
    } else { 
        return 'Message has been sent.'; 
    }
}

?>