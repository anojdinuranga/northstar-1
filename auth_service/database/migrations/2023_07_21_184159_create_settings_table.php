<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 200);
            $table->longText('value');
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
        });


        // Add auto-increment to id column
        // Schema::table('settings', function (Blueprint $table) {
        //     $table->increments('id')->change();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
