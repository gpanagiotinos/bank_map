<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Merchants extends Model
{
    //
    	protected $fillable = [
		'name',
		'merchant_id',
		'merchant_nbr',
		'merch_type',
		'acq_id',
		'street',
		'street_number',
		'city',
		'post_code',
		'latitude',
		'longitude',
		'bank',
		'place_id',
        'alg_stage',
        'perc_certainty',
		'loc_status'
	];
    //

	public $timestamps = false;
}
