<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Input;
//use Merchants model to insert a reacord in the Merchants db table
use App\Merchants;


class UploadfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        //pass var to javascript
        return view('uploadfile');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    //Method to load data to sql server db

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    
    public function store(Request $request)
    {
        //Retrieving json data from ajax post
        $result = Input::json();
        //Convert json data to parameterBag
        $content = $result->all(); 
        $param_number = $result->count();


        //Populate the db table Merchants
        foreach ($content as $key => $value){
            
            $merchant = new Merchants;
            $merchant->name = $content[$key]["merch_name"];
            $merchant->merchant_id = $content[$key]["merch_id"];
            $merchant->acq_id = $content[$key]["acq_id"];
            $merchant->merchant_nbr = $content[$key]["merch_nbr"];
            $merchant->merch_type = $content[$key]["merch_type"];
            $merchant->street = $content[$key]["street"];
            $merchant->street_number = $content[$key]["street_number"];
            $merchant->city = $content[$key]["city"];
            $merchant->post_code = $content[$key]["postcode"];
            $merchant->latitude = $content[$key]["latitude"];
            $merchant->longitude = $content[$key]["longitude"];
            $merchant->place_id = $content[$key]["place_id"];
            $merchant->alg_stage = $content[$key]["alg_stage"];
            $merchant->loc_status = $content[$key]["location_status"];
            if (($content[$key]["location_status"] == 'uncertain') || ($content[$key]["location_status"] == 'unknown')) {
                $merchant->perc_certainty = 0;  
            }
            $merchant->save();

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
