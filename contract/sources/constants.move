//contract/sources/constants.move

module sui_betting::constants {

    /// Reprezintă partea LONG (pariu că prețul va fi MAI MARE la final).
    public fun side_long(): u8 {
        1
    }

    /// Reprezintă partea SHORT (pariu că prețul va fi MAI MIC la final).
    public fun side_short(): u8 {
        2
    }

    /// Adresa adminului principal (wallet-ul tău)
    public fun admin_address(): address {
        @0xffb9954c8cbe05c90f11cb0ab90938d6eca3fc6b497bcc32b18d2ee143e475cc
    }
}
