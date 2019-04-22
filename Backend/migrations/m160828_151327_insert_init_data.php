<?php

use yii\db\Migration;

class m160828_151327_insert_init_data extends Migration
{
    public function up()
    {
        // Inserting into table 'users'

        $this->insert('{{%users}}', [
            'username' => 'vizor_kpt',
            'auth_key' => '3E_q83m44OEqipY4GHlIA6inKCvzp4U8',
            'password_hash' => '$2y$13$9N7Z0fGzVzejXwyne6hkxu/6M9Sn.HSH4OhslIv8zHhuf6qYoPAuW',
            'password_reset_token' => null,
            'email' => 'vizor_kpt@example.com',
            'parent_id' => null,
            'role' => 1,
            'status' => 1,
            'created_at' => 1472396928,
            'updated_at' => 1472396928,
            'author_id' => null,
            'updater_id' => null,
        ]);

        $this->insert('{{%users}}', [
            'username' => 'kpt_atp5',
            'auth_key' => 'ujno9xXOZ95zerKe3204adk8TgeSabWq',
            'password_hash' => '$2y$13$mppJb8qopd/YRiN5OBYI6.UEZC7mCYGmbgTpSQn2qi5r3ihKaTeLy',
            'password_reset_token' => null,
            'email' => 'kpt_atp5@example.com',
            'parent_id' => null,
            'role' => 1,
            'status' => 1,
            'created_at' => 1472396952,
            'updated_at' => 1472396952,
            'author_id' => null,
            'updater_id' => null,
        ]);

        $this->insert('{{%users}}', [
            'username' => 'atp5_kpt',
            'auth_key' => 'pfhHYn_8Gb3Jjbwu4Mn0zKnVXMAuwPZC',
            'password_hash' => '$2y$13$voiL2/9sbgmK3UCpHTKBVOvsIo/JxrP9YW/KImUa9rhVpxLE77VAC',
            'password_reset_token' => null,
            'email' => 'atp5_kpt@example.com',
            'parent_id' => null,
            'role' => 1,
            'status' => 1,
            'created_at' => 1472397005,
            'updated_at' => 1472397005,
            'author_id' => null,
            'updater_id' => null,
        ]);

        // Inserting into table 'languages'

        $this->insert('{{%languages}}', [
            'name' => 'Українська',
            'code' => 'uk',
            'status' => 1,
            'created_at' => 1472397030,
            'updated_at' => 1472397030,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%languages}}', [
            'name' => 'Русский',
            'code' => 'ru',
            'status' => 2,
            'created_at' => 1472397060,
            'updated_at' => 1472397060,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%languages}}', [
            'name' => 'English',
            'code' => 'en',
            'status' => 2,
            'created_at' => 1472397090,
            'updated_at' => 1472397090,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        // Inserting into table 'vehicle_types'

        $this->insert('{{%vehicle_types}}', [
            'name' => 'Автобус',
            'created_at' => 1472397110,
            'updated_at' => 1472397110,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types}}', [
            'name' => 'Тролейбус',
            'created_at' => 1472397140,
            'updated_at' => 1472397140,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types}}', [
            'name' => 'Трамвай',
            'created_at' => 1472397170,
            'updated_at' => 1472397170,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types}}', [
            'name' => 'Швидкісний трамвай',
            'created_at' => 1472397200,
            'updated_at' => 1472397200,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types}}', [
            'name' => 'Електропоїзд',
            'created_at' => 1472397230,
            'updated_at' => 1472397230,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        // Inserting into table 'vehicle_types_lang'

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 1,
            'languages_id' => 1,
            'name' => 'Автобус',
            'created_at' => 1472397260,
            'updated_at' => 1472397260,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 1,
            'languages_id' => 2,
            'name' => 'Автобус',
            'created_at' => 1472397290,
            'updated_at' => 1472397290,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 1,
            'languages_id' => 3,
            'name' => 'Bus',
            'created_at' => 1472397310,
            'updated_at' => 1472397310,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 2,
            'languages_id' => 1,
            'name' => 'Тролейбус',
            'created_at' => 1472397340,
            'updated_at' => 1472397340,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 2,
            'languages_id' => 2,
            'name' => 'Троллейбус',
            'created_at' => 1472397370,
            'updated_at' => 1472397370,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 2,
            'languages_id' => 3,
            'name' => 'Trolleybus',
            'created_at' => 1472397370,
            'updated_at' => 1472397370,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 3,
            'languages_id' => 1,
            'name' => 'Трамвай',
            'created_at' => 1472397400,
            'updated_at' => 1472397400,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 3,
            'languages_id' => 2,
            'name' => 'Трамвай',
            'created_at' => 1472397430,
            'updated_at' => 1472397430,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 3,
            'languages_id' => 3,
            'name' => 'Tram',
            'created_at' => 1472397460,
            'updated_at' => 1472397460,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 4,
            'languages_id' => 1,
            'name' => 'Швидкісний трамвай',
            'created_at' => 1472397490,
            'updated_at' => 1472397490,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 4,
            'languages_id' => 2,
            'name' => 'Скоростной трамвай',
            'created_at' => 1472397510,
            'updated_at' => 1472397510,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 4,
            'languages_id' => 3,
            'name' => 'Speed Tram',
            'created_at' => 1472397540,
            'updated_at' => 1472397540,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 5,
            'languages_id' => 1,
            'name' => 'Електропоїзд',
            'created_at' => 1472397560,
            'updated_at' => 1472397560,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 5,
            'languages_id' => 2,
            'name' => 'Электропоезд',
            'created_at' => 1472397590,
            'updated_at' => 1472397590,
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_types_lang}}', [
            'vehicle_types_id' => 5,
            'languages_id' => 3,
            'name' => 'Electric Train',
            'created_at' => 1472397610,
            'updated_at' => 1472397610,
            'author_id' => 1,
            'updater_id' => 1,
        ]);
    }

    public function down()
    {
        echo "m160828_151327_insert_init_data cannot be reverted.\n";

        return false;
    }
}
