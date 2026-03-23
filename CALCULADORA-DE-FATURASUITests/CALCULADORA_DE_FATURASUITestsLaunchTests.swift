//
//  CALCULADORA_DE_FATURASUITestsLaunchTests.swift
//  CALCULADORA-DE-FATURASUITests
//
//  Created by Marcos Gomes Filho on 23/03/26.
//

import XCTest

final class CALCULADORA_DE_FATURASUITestsLaunchTests: XCTestCase {

    override class var runsForEachTargetApplicationUIConfiguration: Bool {
        true
    }

    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    @MainActor
    func testLaunch() throws {
        let app = XCUIApplication()
        app.launch()

        // Insert steps here to perform after app launch but before taking a screenshot,
        // such as logging into a test account or navigating somewhere in the app

        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = "Launch Screen"
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
