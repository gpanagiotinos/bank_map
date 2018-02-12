<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    //transction table columns
    protected $fillable = [
	    'card_number', 
	    'transaction_date',
		'merchant_id',
		'merchant_nbr',
		'acq_id'
	];
    //

	public $timestamps = false;
}
