<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

require __DIR__ . '/vendor/autoload.php';

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Function to get client IP address
function getClientIP() {
    return $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
}

// Function to check and update request log
function canSendMail($ip) {
    $logFile = '/var/log-custom/it-services-tomic-mailer.json';
    $logData = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
    $currentTime = time();
    $weekAgo = $currentTime - (7 * 24 * 60 * 60);

    // Filter out old entries
    $logData = array_filter($logData, function($entry) use ($weekAgo) {
        return $entry['timestamp'] >= $weekAgo;
    });

    // Count requests from the same IP in the last week
    $ipRequests = array_filter($logData, function($entry) use ($ip) {
        return $entry['ip'] === $ip;
    });

    // Check if the IP has exceeded the limit
    if (count($ipRequests) >= 3) {
        return false;
    }

    // Log the new request
    $logData[] = ['ip' => $ip, 'timestamp' => $currentTime];
    file_put_contents($logFile, json_encode($logData));

    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';
    $ip = getClientIP();

    if (empty($name) || empty($email) || empty($message)) {
        echo "All fields are required.";
        exit;
    }

    if (!canSendMail($ip)) {
        echo "You have exceeded the limit of three submissions per week.";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP server configuration
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USERNAME'];
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $_ENV['SMTP_PORT'];
        
        // Email content
        $mail->setFrom($_ENV['SMTP_SENDER_EMAIL'], $_ENV['SMTP_SENDER_NAME']);
        $mail->addAddress('nemanja.tomic@ik.me', 'Nemanja Tomic');
        $mail->Subject = 'New Contact Form Submission';
        $mail->isHTML(true);
        $mail->Body = "
            <p><strong>Hello Mr. Tomic</strong></p><br>
            <p>You have a new email coming from your <strong>Business Card Website</strong>. Please have a look.</p><br>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Message:</strong></p>
            <p>$message</p><br>
            <p>Thank you,</p>
            <p>Your personal assistent</p>
        ";

        $mail->send();
        
        // Redirect the user to the thank-you page
        header("Location: /thank-you.html");
        exit;
    } catch (Exception $e) {
        echo "Sorry, your message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid request.";
}
?>