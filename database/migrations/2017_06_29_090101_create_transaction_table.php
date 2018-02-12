<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //create table transaction
        Schema::create('Transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('card_number', 19);
            $table->date('transaction_date');
            $table->string('merchant_id', 15);
            $table->string('acq_id' ,8);
            $table->string('merchant_nbr', 15);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
