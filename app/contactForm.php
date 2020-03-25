<?php
/*
 * Config fields
 * You should configure this before using this contact form.
 */
$recipientEmailAddress = 'YOUR_EMAIL_ADDRESS';
$recipientName = 'YOUR_NAME_HERE';
$additionalHeaders = array(
	'MIME-Version: 1.0',
	'Content-Type: text/html; charset=ISO-8859-1',
//	'Content-Type: text/html; charset=UTF-8',
);
/* You can add new allowed tags or remove the existing one, inside the quotes below */
$allowedTags = '<div><p><span><h1><h2><h3><h4><h5><h6><br><hr><code><pre><blockquote><cite>';
$debug = false;
//#! placeholder: use the fields from config.
// Ex: to display the first name: #first_namet# will display the value specified in the user name field of the contact form
// etc...

$thankYouMessage = 'Thank you for your message. We will be getting back to you as soon as possible.';

/*
* Fields configuration for validation
*/
$fieldsConfig = array(
	//#! request a quote form
	'cf_1' => array(
		'your_name' => array( 'value_not_empty' => 'Please specify a value for the name field' ),
		'subject' => array(
			'value_not_empty' => 'Please enter a subject',
		),
		'email' => array(
			// FUNCTION_NAME => ERROR_MESSAGE
			'value_not_empty' => 'Please specify a value for the Email field',
			'is_valid_email' => 'Please enter a valid email',
		),
		'phone' => array(
			'value_not_empty' => 'Please enter your phone',
		),
		'message' => array(
			'value_not_empty' => 'Please enter a message',
		)
	),
	//#! contact page form
	'cf_2' => array(
		'your_name' => array( 'value_not_empty' => 'Please specify a value for the name field' ),
		'subject' => array(
			'value_not_empty' => 'Please enter a subject',
		),
		'email' => array(
			// FUNCTION_NAME => ERROR_MESSAGE
			'value_not_empty' => 'Please specify a value for the Email field',
			'is_valid_email' => 'Please enter a valid email',
		),
		'phone' => array(
			'value_not_empty' => 'Please enter your phone',
		),
		'message' => array(
			'value_not_empty' => 'Please enter a message',
		)
	),
);

//#! How to: Add a new input to the contact form
//#! How to: Access this field later on: $postFields['username']
/*
$fieldsConfig['username'] = array(
	// FUNCTION_NAME => ERROR_MESSAGE
	'value_not_empty' => 'Please specify a value for the username field',
	'is_valid_email' => 'Please enter a valid username'
);
*/

//<editor-fold desc=":: HELPER FUNCTIONS ::">
function jsonSuccess( $data ) {
	header('Content-Type: application/json');
	header('Cache-Control: no-cache');
	header('Pragma: no-cache');
	exit( json_encode( array( 'success' => true, 'data' => $data ) ) );
}
function jsonError( $data ) {
	header('Content-Type: application/json');
	header('Cache-Control: no-cache');
	header('Pragma: no-cache');
	if( is_string($data)){
		$data = array( $data );
	}
	exit( json_encode( array( 'success' => false, 'data' => $data ) ) );
}
function value_not_empty( $value ){
	return ( ! empty( $value ) );
}

function is_valid_email( $value ){
	return filter_var($value, FILTER_VALIDATE_EMAIL);
}
function esc_html( $value, $stripTags = true, $allowTags = '' ) {
	if( $stripTags ){
		$value = strip_tags($value, $allowTags );
	}
	return trim( $value );
}
function unescape_html( $value ) {
	return stripslashes( $value );
}
//</editor-fold desc=":: HELPER FUNCTIONS ::">

//<editor-fold desc=":: Validate POST request ::">
if( 'POST' != strtoupper($_SERVER['REQUEST_METHOD']) ){
	jsonError( 'Invalid Request.' );
}

//#! Setup the post fields list
$postFields = array();
$fields = ( isset($_POST['fields']) ? $_POST['fields'] : null );
if( empty($fields)) {
	jsonError( 'Invalid request, fields are missing.');
}

parse_str($_POST['fields'], $postFields);
//jsonError('DATA: '.var_export($postFields,1));



//#! Make sure the fields are there
if( empty($postFields)) {
	jsonError( 'Invalid request, fields are missing.');
}

if( ! isset($postFields['cf_type'])  ){
	 jsonError( 'Invalid Request: Form type is missing' );
}

if( ! in_array( $postFields['cf_type'], array( 'cf_1', 'cf_2' ) ) ){
	jsonError( 'Invalid Request: Invalid form type' );
}
$cfType = $postFields['cf_type'];

//#! Holds the errors generated during the request
$errors = array();

//#! Sanitize data
foreach( $postFields as $fieldName => &$fieldValue ) {
	$fieldValue = esc_html( $fieldValue, true, $allowedTags );
}

//#! Validate request
foreach( $fieldsConfig[$cfType] as $fieldName => $validationRules ) {
	if( isset( $postFields[$fieldName] ) ){

		$fv = $postFields[$fieldName];

		foreach( $validationRules as $fn => $err) {
			$result = call_user_func( $fn, $fv );
			if( ! $result ){
				array_push( $errors, $err );
			}
		}
	}
	else { array_push( $errors, 'Invalid request, input <strong>'.$fieldName.'</strong> is missing.' ); }
}

//#! Check for errors
if( ! empty($errors)){
	jsonError( $errors );
}

//#! Unescape fields
foreach($postFields as &$input) {
	unescape_html($input);
}

//</editor-fold desc=":: Validate POST request ::">

//<editor-fold desc=":: Compose message and send email ::">

if($cfType = "cf_1") {
	$subject = sprintf( $postFields['subject'], $postFields['your_name'], $postFields['service']);
	$message = '<div>';
	$message .= $postFields['message'];
	$message .= '</div>';
	//#! Configure headers
	array_push( $additionalHeaders, sprintf( 'From: %s<%s>', $recipientName, $recipientEmailAddress ) );
	array_push( $additionalHeaders, sprintf( 'Reply-to: %s<%s>', $postFields['your_name'], $postFields['email'] ) );
	array_push( $additionalHeaders, 'X-Mailer: PHP/' . phpversion() );
	$additionalHeaders = implode( "\r\n", $additionalHeaders);
}
elseif($cfType = "cf_2") {
	$subject = sprintf( $postFields['subject2'], $postFields['your_name2']);
	$message = '<div>';
	$message .= $postFields['message2'];
	$message .= '</div>';
	//#! Configure headers
	array_push( $additionalHeaders, sprintf( 'From: %s<%s>', $recipientName, $recipientEmailAddress ) );
	array_push( $additionalHeaders, sprintf( 'Reply-to: %s<%s>', $postFields['your_name2'], $postFields['email2'] ) );
	array_push( $additionalHeaders, 'X-Mailer: PHP/' . phpversion() );
	$additionalHeaders = implode( "\r\n", $additionalHeaders);
}


$result = @mail( $recipientEmailAddress, $subject, $message, $additionalHeaders );

if( true != $result ) {
	if( $debug ){
		jsonError($result);
	}
	else {
		jsonError('An error occurred, please try again later.');
	}
}

jsonSuccess($thankYouMessage);
//</editor-fold desc=":: Compose message and send email ::">
