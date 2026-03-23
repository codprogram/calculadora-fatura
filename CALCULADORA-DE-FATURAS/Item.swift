//
//  Item.swift
//  CALCULADORA-DE-FATURAS
//
//  Created by Marcos Gomes Filho on 23/03/26.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
