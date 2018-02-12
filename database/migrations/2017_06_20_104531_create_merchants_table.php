<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMerchantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Merchants', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('merchant_id', 15);
            $table->string('acq_id' ,8);
            $table->string('merchant_nbr', 15);
            $table->string('merch_type');
            $table->string('street');
            $table->string('street_number');
            $table->string('city');
            $table->string('post_code');
            $table->decimal('latitude' ,10, 6);
            $table->decimal('longitude' ,10, 6);
            $table->string('bank', 35)->default('unknown');
            $table->string('loc_status', 9);
            $table->string('place_id');
            $table->string('alg_stage');
            $table->decimal('perc_certainty', 5, 4)->default(0.9000);
            //$table->timestamps();
        });
        DB::statement('ALTER TABLE Merchants ADD CONSTRAINT chk_perc_certainty CHECK ((perc_certainty <= 1.0000) AND (perc_certainty >= 0));');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('Merchants');
    }
}
