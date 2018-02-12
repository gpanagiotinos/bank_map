<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Input;

use App\Transactions;
use App\Merchants;
use DB;

class UploadTransactionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
         return view('transactions');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
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
        //load transactions in to sql server
        $result = Input::json();
        //Convert json data to parameterBag
        $content = $result->all(); 
        $param_number = $result->count();
        
        //Populate the db table Transactions
        foreach ($content as $key => $value){
            if ($key <= ($param_number-1)) {    
                $transaction = new Transactions;
                $transaction->card_number = $content[$key]['card_number'];
                $transaction->transaction_date = $content[$key]['transaction_date'];
                $transaction->merchant_id = $content[$key]['merch_id'];
                $transaction->acq_id = $content[$key]['acq_id'];
                $transaction->merchant_nbr = $content[$key]['merch_nbr'];
                $transaction->save();
            }
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
        $merchants = DB::table('Merchants')
                    ->select('name', 'latitude', 'longitude', 'place_id')
                    ->where('loc_status', '=', 'known' )
                    ->get();
        return view('procedure', compact('merchants', $merchants));
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


    public function store_procedure(){

        $alg_step = DB::table('Merchants')->max('alg_stage');
        $alg_step = intval($alg_step);
        //$result = DB::statement('EXEC dbo.find_close_location ?', array($alg_step));
        $known_merch = Merchants::where('loc_status', '=', 'known')->get();
        $count_merch = $known_merch->count();
        //dd($known_merch);
        session()->flash('flash_msg', 'Store Procedure have finished processing the transaction data');
        return view('procedure');
    }

}
